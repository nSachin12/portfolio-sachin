"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/actions/auth"
import type { Profile, SocialLink, ActionResult } from "@/lib/types"

const AVATAR_BUCKET = "profile-avatars"

function revalidateProfileViews() {
  revalidatePath("/")
  revalidatePath("/about")
  revalidatePath("/resume")
  revalidatePath("/admin/profile")
}

function getStorageObjectPath(publicUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(publicUrl.slice(index + marker.length))
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("*").limit(1).single()
  return data ?? null
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .order("order_index")
  return data ?? []
}

export async function updateProfile(id: string, payload: Partial<Profile>): Promise<ActionResult<Profile>> {
  const supabase = await createServiceClient()
  const { data: existing } = await supabase.from("profiles").select("avatar_url").eq("id", id).single()

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", id)
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  if (payload.avatar_url && existing?.avatar_url && existing.avatar_url !== payload.avatar_url) {
    const oldPath = getStorageObjectPath(existing.avatar_url, AVATAR_BUCKET)
    if (oldPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([oldPath])
    }
  }

  revalidateProfileViews()
  return { success: true, data }
}

export async function createProfile(payload: Partial<Profile>): Promise<ActionResult<Profile>> {
  const user = await getUser()
  if (!user) return { success: false, error: "You must be signed in to create a profile." }

  const supabase = await createServiceClient()
  const { data: existing } = await supabase.from("profiles").select("id").eq("user_id", user.id).single()

  if (existing?.id) {
    return updateProfile(existing.id, payload)
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      full_name: payload.full_name ?? "Nadimidoddi Sachin",
      title: payload.title ?? "AI Automation Engineer",
      tagline: payload.tagline ?? null,
      bio: payload.bio ?? null,
      location: payload.location ?? null,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      avatar_url: payload.avatar_url ?? null,
      availability: payload.availability ?? "available",
      years_of_exp: payload.years_of_exp ?? 0,
      months_of_exp: payload.months_of_exp ?? 0,
      github_url: payload.github_url ?? null,
      linkedin_url: payload.linkedin_url ?? null,
      twitter_url: payload.twitter_url ?? null,
      website_url: payload.website_url ?? null,
    })
    .select()
    .single()

  if (error) return { success: false, error: error.message }

  revalidateProfileViews()
  return { success: true, data }
}

export async function uploadProfileAvatar(formData: FormData): Promise<ActionResult<{ avatar_url: string }>> {
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
    .from(AVATAR_BUCKET)
    .upload(path, file, { contentType: file.type || "image/*", upsert: false })

  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` }
  }

  const { data: publicUrl } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
  return { success: true, data: { avatar_url: publicUrl.publicUrl } }
}
