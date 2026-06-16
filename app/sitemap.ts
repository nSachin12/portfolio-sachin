import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"
import { siteConfig } from "@/config/site"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/experience`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/skills`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/certifications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/testimonials`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/hire-me`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ]

  try {
    const supabase = await createClient()

    const [{ data: projects }, { data: blogs }] = await Promise.all([
      supabase.from("projects").select("slug, updated_at").eq("published", true),
      supabase.from("blogs").select("slug, updated_at").eq("published", true),
    ])

    const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    }))

    const blogRoutes: MetadataRoute.Sitemap = (blogs ?? []).map((b) => ({
      url: `${base}/blog/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: "monthly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...projectRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
