"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ArrowRight, ExternalLink, Github, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Project } from "@/lib/types"

interface FeaturedProjectsProps {
  projects: Project[]
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 via-purple/10 to-cyan/10 overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="blue" className="text-xs">Featured</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <div>
          <h3 className="font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{project.description}</p>
        </div>

        {/* Tech stack */}
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="glass" className="text-xs max-w-full whitespace-normal break-words">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="glass" className="text-xs">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button asChild size="sm" variant="ghost" className="flex-1 text-xs h-8">
            <Link href={`/projects/${project.slug}`}>
              View Details
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  if (!projects.length) return null

  return (
    <section ref={ref} className="py-24 px-4 sm:px-10 lg:px-16 xl:px-28 border-t border-border/40 bg-card/20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Work</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground mt-2">A selection of my best AI & automation work</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/projects">
              All Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {inView && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
