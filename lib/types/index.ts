// =============================================
// DATABASE ROW TYPES
// =============================================

export interface Profile {
  id: string
  user_id: string
  full_name: string
  title: string
  tagline: string | null
  bio: string | null
  location: string | null
  email: string | null
  phone: string | null
  avatar_url: string | null
  availability: "available" | "busy" | "open"
  years_of_exp: number
  months_of_exp: number
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  website_url: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  overview: string | null
  problem: string | null
  solution: string | null
  architecture: string | null
  results: string | null
  image_url: string | null
  screenshots: ProjectScreenshot[]
  category: string | null
  technologies: string[]
  github_url: string | null
  live_url: string | null
  featured: boolean
  published: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface ProjectScreenshot {
  url: string
  caption?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon: string | null
  order_index: number
  created_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  description: string | null
  responsibilities: string[]
  technologies: string[]
  company_logo: string | null
  company_url: string | null
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  order_index: number
  created_at: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  description: string | null
  issue_date: string | null
  expiry_date: string | null
  credential_id: string | null
  credential_url: string | null
  certificate_url: string | null
  image_url: string | null
  skills: string[]
  featured: boolean
  order_index: number
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string | null
  category: "Award" | "Competition" | "Internship" | "Recognition" | "Publication"
  date: string | null
  organization: string | null
  image_url: string | null
  url: string | null
  order_index: number
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image_url: string | null
  category: string | null
  tags: string[]
  reading_time: number
  views: number
  published: boolean
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  avatar_url: string | null
  content: string
  rating: number
  linkedin_url: string | null
  featured: boolean
  published: boolean
  order_index: number
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  display_name: string | null
  order_index: number
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  company: string | null
  role: string | null
  message: string
  is_read: boolean
  replied_at: string | null
  created_at: string
}

export interface RecruiterLead {
  id: string
  name: string
  company: string | null
  email: string
  role: string | null
  message: string | null
  source: "contact" | "hire_me" | "chat"
  status: "new" | "contacted" | "in_progress" | "closed"
  is_read: boolean
  created_at: string
}

export interface Resume {
  id: string
  file_url: string
  file_name: string
  version: string | null
  download_count: number
  is_active: boolean
  created_at: string
}

export interface Setting {
  id: string
  key: string
  value: string | null
  type: "string" | "boolean" | "json" | "number"
  description: string | null
  created_at: string
  updated_at: string
}

export interface PageView {
  id: string
  page: string
  referrer: string | null
  country: string | null
  created_at: string
}

// =============================================
// FORM / ACTION TYPES
// =============================================

export type ActionResult<T = void> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string }

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
