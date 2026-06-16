"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Skill } from "@/lib/types"

const categoryVariants: Record<string, "blue" | "purple" | "cyan" | "green" | "orange" | "rose"> = {
  "AI / ML": "blue",
  "Automation": "purple",
  "Backend": "cyan",
  "Frontend": "green",
  "Programming": "orange",
  "DevOps": "rose",
  "Database": "blue",
  "Tools": "purple",
}

const categoryTextClasses: Record<string, string> = {
  "AI / ML": "text-purple-300",
  "Automation": "text-violet-300",
  "Backend": "text-cyan-300",
  "Frontend": "text-emerald-300",
  "Programming": "text-orange-300",
  "DevOps": "text-rose-300",
  "Database": "text-blue-300",
  "Tools": "text-fuchsia-300",
}

const categoryPillClasses: Record<string, string> = {
  "AI / ML": "bg-purple-500/20 text-purple-100 border-purple-400/30",
  "Automation": "bg-violet-500/20 text-violet-100 border-violet-400/30",
  "Backend": "bg-cyan-500/20 text-cyan-100 border-cyan-400/30",
  "Frontend": "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
  "Programming": "bg-orange-500/20 text-orange-100 border-orange-400/30",
  "DevOps": "bg-rose-500/20 text-rose-100 border-rose-400/30",
  "Database": "bg-blue-500/20 text-blue-100 border-blue-400/30",
  "Tools": "bg-fuchsia-500/20 text-fuchsia-100 border-fuchsia-400/30",
}

const categoryPriority = ["Programming", "Backend", "Frontend", "AI / ML", "Automation", "Database", "DevOps", "Tools"]

function groupSkills(skills: Skill[]) {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})
}

function getTopSkillsByCategory(skills: Skill[]) {
  const grouped = groupSkills(skills)
  return Object.entries(grouped)
    .map(([category, categorySkills]) => ({
      category,
      color: categoryVariants[category] ?? "blue",
      skills: categorySkills
        .slice()
        .sort((a, b) => b.proficiency - a.proficiency || a.name.localeCompare(b.name))
        .slice(0, 7),
    }))
    .sort((a, b) => {
      const aIndex = categoryPriority.indexOf(a.category)
      const bIndex = categoryPriority.indexOf(b.category)
      if (aIndex === -1 && bIndex === -1) return a.category.localeCompare(b.category)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
}

export function SkillsPreview({ skills }: { skills: Skill[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const skillGroups = getTopSkillsByCategory(skills)

  return (
    <section ref={ref} className="py-24 px-4 sm:px-10 lg:px-16 xl:px-28 bg-card/40 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] mb-2 text-cyan-300">Skills</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Tech <span className="text-gradient">Stack</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Technologies I work with daily, ordered by the ones that help me build and ship faster.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/skills">
              All Skills <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="space-y-6">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: gi * 0.08 }}
              className="grid grid-cols-1 gap-3 md:grid-cols-[170px_minmax(0,1fr)] md:items-start"
            >
              <div className="flex md:justify-start">
                <Badge
                  variant="outline"
                  className={`min-w-fit px-3 py-1 shadow-sm shadow-black/10 ${categoryPillClasses[group.category] ?? "bg-primary/20 text-primary border-primary/30"}`}
                >
                  <span className="font-semibold tracking-wide">
                    {group.category}
                  </span>
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 md:pt-0.5">
                {group.skills.map((skill, si) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: gi * 0.08 + si * 0.03 }}
                  >
                    <Badge variant="glass" className="text-xs hover:border-primary/30 transition-colors cursor-default">
                      {skill.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
