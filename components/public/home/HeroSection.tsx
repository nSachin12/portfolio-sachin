"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronDown, Download, MapPin, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/lib/types"
import { formatExperienceValue } from "@/lib/utils/format"

interface HeroSectionProps {
  profile: Profile | null
  projectCount?: number
  skillCount?: number
}

const roles = [
  "AI Software Developer",
  "AI Automation Engineer",
  "Workflow Architect",
  "LLM Integrations Dev",
]

function getDisplayName(fullName?: string | null) {
  const parts = fullName?.trim().split(/\s+/).filter(Boolean) ?? []
  if (parts.length === 0) return "Sachin"
  return parts[parts.length - 1]
}

export function HeroSection({ profile, projectCount = 0, skillCount = 0 }: HeroSectionProps) {
  const roleRef = useRef<HTMLSpanElement>(null)
  const roleIndex = useRef(0)
  const charIndex = useRef(0)
  const deleting = useRef(false)

  const bioText =
    profile?.bio ??
    "Building intelligent automation systems that scale — from LLM pipelines to production-grade AI workflows. I turn complex problems into elegant, working solutions."
  const bioRef = useRef<HTMLParagraphElement>(null)
  const [bioExpanded, setBioExpanded] = useState(false)
  const [bioOverflows, setBioOverflows] = useState(false)

  // Detect whether the bio is taller than its 5-line clamp so we only show the
  // "Read more" toggle when there's actually hidden text.
  useEffect(() => {
    const el = bioRef.current
    if (el) setBioOverflows(el.scrollHeight > el.clientHeight + 1)
  }, [bioText])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function type() {
      const el = roleRef.current
      if (!el) return

      const current = roles[roleIndex.current]

      if (!deleting.current) {
        el.textContent = current.slice(0, charIndex.current + 1)
        charIndex.current++
        if (charIndex.current === current.length) {
          deleting.current = true
          timeout = setTimeout(type, 2000)
          return
        }
      } else {
        el.textContent = current.slice(0, charIndex.current - 1)
        charIndex.current--
        if (charIndex.current === 0) {
          deleting.current = false
          roleIndex.current = (roleIndex.current + 1) % roles.length
        }
      }

      timeout = setTimeout(type, deleting.current ? 50 : 80)
    }

    timeout = setTimeout(type, 500)
    return () => clearTimeout(timeout)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  } as const
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  }
  const displayName = getDisplayName(profile?.full_name)

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-purple/5 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-cyan/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-8 lg:px-12 text-center">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          {/* Availability badge */}
          <motion.div variants={item} className="flex justify-center">
            <Badge variant="green" className="gap-1.5 py-1 px-3 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {profile?.availability === "available"
                ? "Available for new opportunities"
                : profile?.availability === "busy"
                ? "Currently focused on a project"
                : "Open to opportunities"}
            </Badge>
          </motion.div>

          {/* Name */}
          <motion.div variants={item}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Hi, I&apos;m </span>
              <span className="text-gradient">{displayName}</span>
            </h1>
          </motion.div>

          {/* Animated role */}
          <motion.div variants={item} className="h-12 flex items-center justify-center">
            <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium">
              <span ref={roleRef} className="text-primary" />
              <span className="animate-pulse text-primary">|</span>
            </p>
          </motion.div>

          {/* Bio — clamped to 5 lines with a Read more / Show less toggle */}
          <motion.div variants={item} className="mx-auto max-w-2xl">
            <p
              ref={bioRef}
              className={cn(
                "text-base sm:text-lg text-muted-foreground leading-relaxed",
                !bioExpanded && "line-clamp-5",
              )}
            >
              {bioText}
            </p>
            {(bioOverflows || bioExpanded) && (
              <button
                type="button"
                onClick={() => setBioExpanded((value) => !value)}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {bioExpanded ? "Show less" : "Read more"}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    bioExpanded && "rotate-180",
                  )}
                />
              </button>
            )}
          </motion.div>

          {/* Location */}
          {profile?.location && (
            <motion.div variants={item} className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button asChild size="lg" variant="glow" className="gap-2">
              <Link href="/projects">
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="glass" className="gap-2">
              <Link href="/hire-me">
                <Sparkles className="h-4 w-4" />
                Hire Me
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2">
              <Link href="/resume">
                <Download className="h-4 w-4" />
                Resume
              </Link>
            </Button>
          </motion.div>

          {/* Stats row — only real, truthful counts; hidden until there's data */}
          {(() => {
            const stats = [
              profile
                ? { value: formatExperienceValue(profile.years_of_exp, profile.months_of_exp), label: "Experience" }
                : null,
              projectCount > 0 ? { value: `${projectCount}`, label: projectCount === 1 ? "Project" : "Projects" } : null,
              skillCount > 0 ? { value: `${skillCount}`, label: "Technologies" } : null,
            ].filter((s): s is { value: string; label: string } => s !== null)

            if (stats.length === 0) return null

            return (
              <motion.div
                variants={item}
                className="pt-8 flex items-stretch justify-center divide-x divide-border/50 mx-auto w-fit"
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="px-6 sm:px-8 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )
          })()}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="pointer-events-none mt-10 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-px bg-gradient-to-b from-primary to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
