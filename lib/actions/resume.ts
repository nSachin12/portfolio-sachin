"use server"

import { revalidatePath } from "next/cache"
import { createServiceClient } from "@/lib/supabase/server"
import type { Resume, ActionResult } from "@/lib/types"

const BUCKET = "resume"

function revalidateResume() {
  revalidatePath("/resume")
  revalidatePath("/admin/resume")
}

/** Deactivate every resume row except `keepId` (if provided). */
async function deactivateOthers(supabase: Awaited<ReturnType<typeof createServiceClient>>, keepId?: string) {
  let query = supabase.from("resume").update({ is_active: false }).eq("is_active", true)
  if (keepId) query = query.neq("id", keepId)
  await query
}

/**
 * Upload a PDF file to Supabase Storage and create a resume row.
 * Receives FormData with: file (File), version (string), is_active ("true" | "false").
 */
export async function uploadResume(formData: FormData): Promise<ActionResult<Resume>> {
  const file = formData.get("file")
  const version = (formData.get("version") as string | null)?.trim() || null
  const makeActive = formData.get("is_active") === "true"

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose a PDF file to upload." }
  }
  if (file.type && file.type !== "application/pdf") {
    return { success: false, error: "Only PDF files are allowed." }
  }
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File is too large (max 10MB)." }
  }

  const supabase = await createServiceClient()

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: "application/pdf", upsert: false })

  if (uploadError) return { success: false, error: `Upload failed: ${uploadError.message}` }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

  if (makeActive) await deactivateOthers(supabase)

  const { data, error } = await supabase
    .from("resume")
    .insert({
      file_url: pub.publicUrl,
      file_name: file.name,
      version,
      is_active: makeActive,
    })
    .select()
    .single()

  if (error) {
    // Roll back the uploaded object if the row insert failed
    await supabase.storage.from(BUCKET).remove([path])
    return { success: false, error: error.message }
  }

  revalidateResume()
  return { success: true, data }
}

/** Create a resume row from an externally-hosted PDF URL (no upload). */
export async function createResumeFromUrl(payload: {
  file_url: string
  file_name: string
  version?: string | null
  is_active?: boolean
}): Promise<ActionResult<Resume>> {
  if (!payload.file_url) return { success: false, error: "A file URL is required." }
  const supabase = await createServiceClient()

  if (payload.is_active) await deactivateOthers(supabase)

  const { data, error } = await supabase
    .from("resume")
    .insert({
      file_url: payload.file_url,
      file_name: payload.file_name || "resume.pdf",
      version: payload.version || null,
      is_active: payload.is_active ?? false,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidateResume()
  return { success: true, data }
}

/** Make one resume the active/published one and deactivate the rest. */
export async function setActiveResume(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  await deactivateOthers(supabase, id)
  const { error } = await supabase.from("resume").update({ is_active: true }).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidateResume()
  return { success: true, data: null }
}

/** Update the version label on a resume. */
export async function updateResumeVersion(id: string, version: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("resume").update({ version: version.trim() || null }).eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidateResume()
  return { success: true, data: null }
}

/** Delete a resume row and its stored file (if it lives in our bucket). */
export async function deleteResume(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()

  const { data: existing } = await supabase.from("resume").select("file_url").eq("id", id).single()

  const { error } = await supabase.from("resume").delete().eq("id", id)
  if (error) return { success: false, error: error.message }

  // Best-effort storage cleanup for files hosted in our bucket
  const marker = `/${BUCKET}/`
  if (existing?.file_url?.includes(marker)) {
    const path = existing.file_url.split(marker)[1]
    if (path) await supabase.storage.from(BUCKET).remove([decodeURIComponent(path)])
  }

  revalidateResume()
  return { success: true, data: null }
}
