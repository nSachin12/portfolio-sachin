"use client"

import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

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

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const page = pageTitles[pathname] ?? { title: "Admin", description: "" }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden -ml-1 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{page.title}</h1>
          {page.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{page.description}</p>
          )}
        </div>
      </div>
    </header>
  )
}
