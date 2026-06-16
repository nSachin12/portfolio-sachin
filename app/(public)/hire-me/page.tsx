import type { Metadata } from "next"
import { Clock, Code2, Brain, Workflow } from "lucide-react"
import { HireMeForm } from "@/components/public/hire/HireMeForm"

export const metadata: Metadata = {
  title: "Hire Me",
  description:
    "Work with Nadimidoddi Sachin — AI Automation Engineer available for freelance and full-time roles.",
}

const services = [
  {
    icon: Brain,
    title: "LLM Integration",
    description: "Integrate GPT-4, Claude, Llama, and other LLMs into your product via RAG, fine-tuning, and custom pipelines.",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and business processes using n8n, Make.com, Python, and custom APIs.",
  },
  {
    icon: Code2,
    title: "AI SaaS Products",
    description: "Full-stack AI products built with Next.js, FastAPI, Supabase, and modern cloud infrastructure.",
  },
]

export default function HireMePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Work With Me</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Let&apos;s Build Something <span className="text-gradient">Extraordinary</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Available for freelance projects, consulting, and full-time opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services */}
            <div className="space-y-4">
              {services.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="rounded-xl border border-border bg-card p-4 flex gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Available now</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Taking on new projects</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-semibold text-foreground text-lg mb-2">Tell me about your project</h2>
              <p className="text-sm text-muted-foreground mb-6">
                I&apos;ll review your inquiry and respond within 24 hours with a tailored approach.
              </p>
              <HireMeForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
