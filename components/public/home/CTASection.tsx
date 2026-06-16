"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-28 px-4 sm:px-10 lg:px-16 xl:px-28 border-t border-border/40">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-purple/5 to-cyan/5 p-8 sm:p-12 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 mx-auto"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Let&apos;s <span className="text-gradient">work together</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Have a project in mind — automation, an LLM integration, or a web app? I&apos;d be happy to help.
            Feel free to reach out.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="xl" variant="glow" className="gap-2">
              <Link href="/hire-me">
                <Sparkles className="h-5 w-5" />
                Work With Me
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="glass" className="gap-2">
              <Link href="/contact">
                <Mail className="h-5 w-5" />
                Send a Message
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            I&apos;ll get back to you as soon as I can.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
