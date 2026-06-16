"use server"

import { revalidatePath } from "next/cache"
import { createClient, createServiceClient } from "@/lib/supabase/server"
import type { Blog, ActionResult, PaginatedResult, PaginationParams } from "@/lib/types"
import { blogSchema } from "@/lib/validations"
import { estimateReadingTime } from "@/lib/utils/format"
import type { z } from "zod"

type BlogInput = z.input<typeof blogSchema>

export async function getPublishedBlogs(
  params: Partial<PaginationParams> & { category?: string } = {}
): Promise<PaginatedResult<Blog>> {
  const { page = 1, limit = 12, category } = params
  const supabase = await createClient()

  let query = supabase
    .from("blogs")
    .select("*", { count: "exact" })
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (category) query = query.eq("category", category)

  const from = (page - 1) * limit
  const to = from + limit - 1
  const { data, count } = await query.range(from, to)

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()
  return data ?? null
}

export async function getAllBlogsAdmin(): Promise<Blog[]> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false })
  return data ?? []
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("blogs").select("*").eq("id", id).single()
  return data ?? null
}

export async function createBlog(input: BlogInput): Promise<ActionResult<Blog>> {
  const parsed = blogSchema.parse(input)
  const supabase = await createServiceClient()

  const payload = {
    ...parsed,
    reading_time: estimateReadingTime(parsed.content ?? ""),
    published_at: parsed.published ? new Date().toISOString() : null,
  }

  const { data, error } = await supabase.from("blogs").insert(payload).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/blog")
  revalidatePath(`/blog/${parsed.slug}`)
  return { success: true, data }
}

export async function updateBlog(id: string, input: Partial<BlogInput>): Promise<ActionResult<Blog>> {
  const supabase = await createServiceClient()

  const payload: Record<string, unknown> = { ...input }
  if (typeof input.content === "string") {
    payload.reading_time = estimateReadingTime(input.content)
  }
  if (input.published) {
    const { data: existing } = await supabase.from("blogs").select("published_at").eq("id", id).single()
    if (existing && !existing.published_at) payload.published_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from("blogs").update(payload).eq("id", id).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath("/blog")
  if (input.slug) revalidatePath(`/blog/${input.slug}`)
  return { success: true, data }
}

export async function deleteBlog(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("blogs").delete().eq("id", id)
  if (error) return { success: false, error: error.message }
  revalidatePath("/blog")
  return { success: true, data: null }
}

export async function incrementBlogViews(id: string): Promise<void> {
  const supabase = await createServiceClient()
  const { data } = await supabase.from("blogs").select("views").eq("id", id).single()
  if (data) await supabase.from("blogs").update({ views: (data.views ?? 0) + 1 }).eq("id", id)
}
