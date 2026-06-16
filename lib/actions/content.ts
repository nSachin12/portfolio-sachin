"use server"

import { revalidatePath } from "next/cache"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import type {
  Skill,
  Experience,
  Certification,
  Achievement,
  Testimonial,
  Resume,
  ActionResult,
} from "@/lib/types"

// ── Skills ──────────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("skills").select("*").order("order_index")
  return data ?? []
}

export async function getSkillById(id: string): Promise<Skill | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("skills").select("*").eq("id", id).single()
  return data ?? null
}

export async function createSkill(payload: Omit<Skill, "id" | "created_at" | "order_index"> & { order_index?: number }): Promise<ActionResult<Skill>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("skills").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/skills")
  revalidatePath("/about")
  return { success: true, data }
}

export async function updateSkill(id: string, payload: Partial<Skill>): Promise<ActionResult<Skill>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("skills").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/skills")
  revalidatePath("/about")
  return { success: true, data }
}

export async function deleteSkill(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/skills")
  revalidatePath("/about")
  return { success: true, data: null }
}

// ── Experience ───────────────────────────────────────────────────────────────

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("experience").select("*").order("order_index")
  return data ?? []
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("experience").select("*").eq("id", id).single()
  return data ?? null
}

export async function createExperience(payload: Omit<Experience, "id" | "created_at" | "order_index"> & { order_index?: number }): Promise<ActionResult<Experience>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("experience").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/experience")
  revalidatePath("/resume")
  return { success: true, data }
}

export async function updateExperience(id: string, payload: Partial<Experience>): Promise<ActionResult<Experience>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("experience").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/experience")
  revalidatePath("/resume")
  return { success: true, data }
}

export async function deleteExperience(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("experience").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/experience")
  revalidatePath("/resume")
  return { success: true, data: null }
}

// ── Certifications ───────────────────────────────────────────────────────────

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("certifications").select("*").order("order_index")
  return data ?? []
}

export async function getCertificationById(id: string): Promise<Certification | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("certifications").select("*").eq("id", id).single()
  return data ?? null
}

export async function createCertification(payload: Omit<Certification, "id" | "created_at" | "order_index"> & { order_index?: number }): Promise<ActionResult<Certification>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("certifications").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/certifications")
  revalidatePath("/resume")
  return { success: true, data }
}

export async function updateCertification(id: string, payload: Partial<Certification>): Promise<ActionResult<Certification>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("certifications").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/certifications")
  revalidatePath("/resume")
  return { success: true, data }
}

export async function deleteCertification(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("certifications").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/certifications")
  revalidatePath("/resume")
  return { success: true, data: null }
}

// ── Achievements ─────────────────────────────────────────────────────────────

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("achievements").select("*").order("order_index")
  return data ?? []
}

export async function getAchievementById(id: string): Promise<Achievement | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("achievements").select("*").eq("id", id).single()
  return data ?? null
}

export async function createAchievement(payload: Omit<Achievement, "id" | "created_at" | "order_index"> & { order_index?: number }): Promise<ActionResult<Achievement>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("achievements").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/achievements")
  return { success: true, data }
}

export async function updateAchievement(id: string, payload: Partial<Achievement>): Promise<ActionResult<Achievement>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("achievements").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/achievements")
  return { success: true, data }
}

export async function deleteAchievement(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("achievements").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/achievements")
  return { success: true, data: null }
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonials(publishedOnly = true): Promise<Testimonial[]> {
  const supabase = await createClient()
  let query = supabase.from("testimonials").select("*").order("order_index")
  if (publishedOnly) query = query.eq("published", true)
  const { data } = await query
  return data ?? []
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("testimonials").select("*").order("order_index")
  return data ?? []
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).single()
  return data ?? null
}

export async function createTestimonial(payload: Omit<Testimonial, "id" | "created_at" | "order_index"> & { order_index?: number }): Promise<ActionResult<Testimonial>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("testimonials").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/testimonials")
  revalidatePath("/")
  return { success: true, data }
}

export async function updateTestimonial(id: string, payload: Partial<Testimonial>): Promise<ActionResult<Testimonial>> {
  const supabase = await createServiceClient()
  const { data, error } = await supabase.from("testimonials").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/testimonials")
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteTestimonial(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/testimonials")
  revalidatePath("/")
  return { success: true, data: null }
}

// ── Resume ───────────────────────────────────────────────────────────────────

export async function getActiveResume(): Promise<Resume | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("resume")
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .single()
  return data ?? null
}

export async function getAllResumes(): Promise<Resume[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("resume").select("*").order("created_at", { ascending: false })
  return data ?? []
}

export async function incrementDownloadCount(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc("increment_resume_downloads", { resume_id: id })
}
