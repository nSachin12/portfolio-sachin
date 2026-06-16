"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Quote, Star } from "lucide-react"
import type { Testimonial } from "@/lib/types"

interface TestimonialsPreviewProps {
  testimonials: Testimonial[]
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function TestimonialsPreview({ testimonials }: TestimonialsPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  // Honest by default: render nothing until there are real testimonials in the database.
  if (!testimonials || testimonials.length === 0) return null

  const items = testimonials.slice(0, 3)

  return (
    <section ref={ref} className="py-24 px-4 sm:px-10 lg:px-16 xl:px-28 border-t border-border/40 bg-card/20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Kind Words</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What People <span className="text-gradient">Say</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex flex-col rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">&ldquo;{t.content}&rdquo;</p>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  {initials(t.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                  {(t.role || t.company) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                {t.rating > 0 && (
                  <div className="ml-auto flex shrink-0">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star key={si} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
