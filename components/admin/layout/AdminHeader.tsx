"use client"

import { usePathname } from "next/navigation"

const pageTitles: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Dashboard", description: "Overview of your portfolio" },
  "/admin/projects": { title: "Projects", description: "Manage your portfolio projects" },
  "/admin/blog": { title: "Blog", description: "Write and publish articles" },
  "/admin/experience": { title: "Experience", description: "Work history & timeline" },
  "/admin/skills": { title: "Skills", description: "Tech stack management" },
  "/admin/certifications": { title: "Certifications", description: "Credentials & certificates" },
  "/admin/achievements": { title: "Achievements", description: "Awards & recognitions" },
  "/admin/testimonials": { title: "Testimonials", description: "Client & colleague reviews" },
  "/admin/resume": { title: "Resume", description: "Upload & manage your resume PDF" },
  "/admin/messages": { title: "Messages", description: "Contact form submissions" },
  "/admin/leads": { title: "Recruiter Leads", description: "Client & recruiter inquiries" },
  "/admin/profile": { title: "Profile", description: "Personal information & bio" },
  "/admin/settings": { title: "Settings", description: "Site configuration" },
}

export function AdminHeader() {
  const pathname = usePathname()
  const page = pageTitles[pathname] ?? { title: "Admin", description: "" }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">{page.title}</h1>
        {page.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{page.description}</p>
        )}
      </div>
    </header>
  )
}
