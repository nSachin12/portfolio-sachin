import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getProjects } from "@/lib/actions/projects"

export const metadata: Metadata = {
  title: "Projects",
  description: "AI, automation, and full-stack projects by Nadimidoddi Sachin.",
}
export const revalidate = 3600

export default async function ProjectsPage() {
  const { data: projects } = await getProjects({ page: 1, limit: 24 })

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 xl:px-24 pt-24 pb-20">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Work</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            All <span className="text-gradient">Projects</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {projects.length > 0
              ? `${projects.length} projects in AI, automation, and full-stack development.`
              : "Projects will appear here once added via the admin dashboard."}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className="relative h-64 sm:h-72 bg-gradient-to-br from-primary/10 via-purple/10 to-cyan/10 overflow-hidden">
                  {project.image_url ? (
                    <Image src={project.image_url} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Layers className="h-14 w-14 text-muted-foreground/30" />
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3"><Badge variant="blue" className="text-xs">Featured</Badge></div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-foreground text-xl leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                    <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="glass" className="text-xs max-w-full whitespace-normal break-words">{tech}</Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="glass" className="text-xs">+{project.technologies.length - 4}</Badge>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
