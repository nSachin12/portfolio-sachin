import Link from "next/link"
import Image from "next/image"
import { getAllProjectsAdmin } from "@/lib/actions/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, Github, Pencil, Layers } from "lucide-react"

export const metadata = { title: "Projects | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects yet.</p>
          <Button asChild size="sm">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Create your first project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/10 via-purple/10 to-cyan/10">
                {project.image_url ? (
                  <Image src={project.image_url} alt={project.title} fill sizes="96px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Layers className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground text-sm truncate">{project.title}</p>
                  {project.featured && <Badge variant="blue" className="text-xs">Featured</Badge>}
                  {!project.published && <Badge variant="glass" className="text-xs">Draft</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.slice(0, 6).map((tech) => (
                    <Badge key={tech} variant="glass" className="text-xs max-w-full whitespace-normal break-words">{tech}</Badge>
                  ))}
                  {project.technologies.length > 6 && (
                    <Badge variant="glass" className="text-xs">+{project.technologies.length - 6}</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                  <Link href={`/admin/projects/${project.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
