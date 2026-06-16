import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Zap, Users, Code2, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getProfile } from "@/lib/actions/profile"
import { getSkills } from "@/lib/actions/content"
import { siteConfig } from "@/config/site"
import { formatExperienceValue } from "@/lib/utils/format"

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${siteConfig.name}, ${siteConfig.title}`,
}

export const revalidate = 3600

const highlights = [
  { icon: Brain, label: "AI Specialist", desc: "LLMs, RAG, fine-tuning, agentic systems" },
  { icon: Code2, label: "Full-Stack", desc: "Next.js, FastAPI, Supabase, Postgres" },
  { icon: Zap, label: "Automation", desc: "n8n, Make.com, workflow orchestration" },
  { icon: Users, label: "Client-Focused", desc: "Clear comms, on-time delivery" },
]

export default async function AboutPage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()])

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">About Me</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Turning <span className="text-gradient">Ideas into AI</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Avatar + stats */}
          <div className="lg:col-span-1 flex flex-col items-center text-center space-y-6">
            <div className="relative h-48 w-48 rounded-2xl overflow-hidden border border-primary/20 bg-card">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl font-bold text-primary/30">
                  {profile?.full_name?.[0] ?? "S"}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">{profile?.full_name ?? "Nadimidoddi Sachin"}</h2>
              <p className="text-primary text-sm font-medium mt-1">{profile?.title ?? "AI Automation Engineer"}</p>
              {profile?.location && (
                <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" /> {profile.location}
                </p>
              )}
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatExperienceValue(profile?.years_of_exp ?? 3, profile?.months_of_exp ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Experience</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">20+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Projects</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">15+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Clients</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4 text-center">
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-lg">My Story</h3>
              {profile?.bio ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{profile.bio}</p>
              ) : (
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    I&apos;m an AI Automation Engineer passionate about building intelligent systems that solve real problems.
                    With a deep focus on LLMs, agentic architectures, and workflow automation, I help businesses harness
                    the power of AI to scale their operations.
                  </p>
                  <p>
                    My journey started in software development, where I quickly became fascinated by the transformative
                    potential of machine learning. Today, I specialize in designing and deploying production-grade AI
                    solutions — from RAG pipelines and fine-tuned models to full-stack SaaS products powered by language models.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((h) => {
                const Icon = h.icon
                return (
                  <div key={h.label} className="rounded-xl border border-border bg-card/50 p-4 flex gap-3 items-start">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Skills by category */}
        {Object.keys(skillsByCategory).length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Skills &amp; <span className="text-gradient">Technologies</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                  <p className="text-sm font-semibold text-primary uppercase tracking-wide">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant="glass">{skill.name}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">Ready to collaborate?</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Whether you&apos;re building a new AI product, automating business workflows, or integrating LLMs into your
            existing stack — I&apos;d love to hear about your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/hire-me" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Hire Me
            </a>
            <a href="/contact" className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
