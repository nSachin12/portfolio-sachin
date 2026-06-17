import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Github, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getProjectBySlug } from "@/lib/actions/projects"

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
    openGraph: project.image_url ? { images: [{ url: project.image_url }] } : undefined,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const sections = [
    { label: "Overview", value: project.overview },
    { label: "Problem", value: project.problem },
    { label: "Solution", value: project.solution },
    { label: "Architecture", value: project.architecture },
    { label: "Results", value: project.results },
  ].filter((s) => s.value && s.value.trim().length > 0)

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            {project.category && <Badge variant="blue" className="text-xs">{project.category}</Badge>}
            {project.featured && <Badge variant="purple" className="text-xs">Featured</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>

          {/* Action buttons */}
          {(project.live_url || project.github_url) && (
            <div className="flex flex-wrap gap-3 mt-6">
              {project.live_url && (
                <Button asChild variant="glow" className="gap-2">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button asChild variant="glass" className="gap-2">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />View Code
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-purple/10 to-cyan/10 mb-10">
          {project.image_url ? (
            <Image src={project.image_url} alt={project.title} fill sizes="(max-width: 896px) 100vw, 896px" priority className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Layers className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="glass" className="text-sm max-w-full whitespace-normal break-words">{tech}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Case study sections */}
        {sections.length > 0 && (
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.label}>
                <h2 className="text-xl font-bold text-foreground mb-3">{section.label}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.value}</p>
              </section>
            ))}
          </div>
        )}

        {/* Screenshots */}
        {project.screenshots?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.screenshots.map((shot, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border border-border">
                  <div className="relative aspect-video bg-card">
                    <Image src={shot.url} alt={shot.caption ?? `${project.title} screenshot ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                  </div>
                  {shot.caption && (
                    <figcaption className="px-3 py-2 text-xs text-muted-foreground">{shot.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
