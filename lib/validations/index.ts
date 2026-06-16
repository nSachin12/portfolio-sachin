import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export const recruiterLeadSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().max(100).optional(),
  email: z.string().email(),
  role: z.string().max(100).optional(),
  message: z.string().max(1000).optional(),
  source: z.enum(["contact", "hire_me", "chat"]).default("contact"),
})

export const projectSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10).max(500),
  overview: z.string().max(2000).optional(),
  problem: z.string().max(2000).optional(),
  solution: z.string().max(2000).optional(),
  architecture: z.string().max(2000).optional(),
  results: z.string().max(2000).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().max(100).optional(),
  technologies: z.array(z.string()).default([]),
  github_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  proficiency: z.number().min(0).max(100),
  icon: z.string().max(100).optional(),
})

export const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  company_logo: z.string().url().optional().or(z.literal("")),
  company_url: z.string().url().optional().or(z.literal("")),
  location: z.string().max(200).optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
})

export const certificationSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_id: z.string().max(200).optional(),
  credential_url: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

export const achievementSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  category: z.enum(["Award", "Competition", "Internship", "Recognition", "Publication"]),
  date: z.string().optional(),
  organization: z.string().max(200).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  url: z.string().url().optional().or(z.literal("")),
})

export const testimonialSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  content: z.string().min(1).max(2000),
  rating: z.coerce.number().min(1).max(5),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
})

export const blogSchema = z.object({
  title: z.string().min(2).max(300),
  slug: z.string().min(2).max(300).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string().optional(),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  meta_title: z.string().max(70).optional(),
  meta_description: z.string().max(160).optional(),
})

export const profileSchema = z.object({
  full_name: z.string().min(2).max(200),
  title: z.string().min(2).max(200),
  tagline: z.string().max(300).optional(),
  bio: z.string().max(3000).optional(),
  location: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(50).optional(),
  availability: z.enum(["available", "busy", "open"]),
  years_of_exp: z.number().min(0).max(50),
  months_of_exp: z.number().min(0).max(11),
  github_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
export type RecruiterLeadValues = z.infer<typeof recruiterLeadSchema>
export type ProjectValues = z.infer<typeof projectSchema>
export type SkillValues = z.infer<typeof skillSchema>
export type ExperienceValues = z.infer<typeof experienceSchema>
export type CertificationValues = z.infer<typeof certificationSchema>
export type AchievementValues = z.infer<typeof achievementSchema>
export type TestimonialValues = z.infer<typeof testimonialSchema>
export type BlogValues = z.infer<typeof blogSchema>
export type ProfileValues = z.infer<typeof profileSchema>
