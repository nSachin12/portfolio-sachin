import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminDashboardPage() {
  const user = await getUser()
  if (!user) redirect("/?auth=required")

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Projects", href: "/admin/projects", description: "Manage your portfolio projects" },
            { label: "Blog Posts", href: "/admin/blog", description: "Write and manage blog content" },
            { label: "Messages", href: "/admin/messages", description: "View contact form submissions" },
            { label: "Leads", href: "/admin/leads", description: "Recruiter & client inquiries" },
            { label: "Experience", href: "/admin/experience", description: "Work history & timeline" },
            { label: "Skills", href: "/admin/skills", description: "Tech stack management" },
            { label: "Profile", href: "/admin/profile", description: "Personal info & bio" },
            { label: "Settings", href: "/admin/settings", description: "Site configuration" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
            >
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.label}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
