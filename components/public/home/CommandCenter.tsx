"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Brain, Workflow, Code2, GraduationCap } from "lucide-react"

const focusAreas = [
  {
    icon: Brain,
    title: "Generative AI & LLMs",
    description: "Building with generative AI and language models — RAG pipelines, prompting, and practical AI features.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Workflow,
    title: "Automation",
    description: "Automating repetitive work with n8n, scripts, third-party SaaS integrations, and API integrations to save time.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Code2,
    title: "AI Fullstack",
    description: "Building web apps end to end with Next.js, FastAPI, Supabase, and PostgreSQL, and I use AI to improve productivity throughout the process.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: GraduationCap,
    title: "Always Learning",
    description: "Exploring new tools and techniques, and sharing what I learn along the way.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
]

export function CommandCenter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-10 lg:px-16 xl:px-28 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">What I Do</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Things I <span className="text-gradient">Work On</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            The areas I focus on as an AI automation engineer.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {focusAreas.map((area, i) => {
            const Icon = area.icon
            return (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative rounded-2xl border ${area.border} ${area.bg} p-6 hover:border-primary/30 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.03] to-transparent" />
                <div className="relative">
                  <div className={`inline-flex p-2.5 rounded-lg ${area.bg} mb-4`}>
                    <Icon className={`h-5 w-5 ${area.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
