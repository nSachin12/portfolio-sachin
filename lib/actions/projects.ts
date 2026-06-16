"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import type { Project, ActionResult, PaginatedResult, PaginationParams } from "@/lib/types"
import { projectSchema } from "@/lib/validations"
import type { z } from "zod"

const PROJECT_IMAGE_BUCKET = "project-images"

/** Upload a project cover image from the device and return its public URL. */
export async function uploadProjectImage(formData: FormData): Promise<ActionResult<{ image_url: string }>> {
  const file = formData.get("file")

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose an image to upload." }
  }
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "Only image files are allowed." }
  }
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: "Image is too large (max 5MB)." }
  }

  const supabase = await createServiceClient()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const path = `${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type || "image/*", upsert: false })

  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` }
  }

  const { data: publicUrl } = supabase.storage.from(PROJECT_IMAGE_BUCKET).getPublicUrl(path)
  return { success: true, data: { image_url: publicUrl.publicUrl } }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("order_index")
    .limit(6)
  return data ?? []
}

export async function getProjects(params: Partial<PaginationParams> & { category?: string } = {}): Promise<PaginatedResult<Project>> {
  const { page = 1, limit = 9, category } = params
  const supabase = await createClient()

  let query = supabase
    .from("projects")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("order_index")

  if (category) query = query.eq("category", category)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query.range(from, to)

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  return data ?? null
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("projects").select("*").order("order_index")
  return data ?? []
}

export async function createProject(payload: z.infer<typeof projectSchema>): Promise<ActionResult<Project>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("projects").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/projects")
  revalidatePath("/")
  return { success: true, data }
}

export async function updateProject(id: string, payload: Partial<z.infer<typeof projectSchema>>): Promise<ActionResult<Project>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("projects").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/projects")
  revalidatePath(`/projects/${payload.slug ?? ""}`)
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteProject(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/projects")
  revalidatePath("/")
  return { success: true, data: null }
}
