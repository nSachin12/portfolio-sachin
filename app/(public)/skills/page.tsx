import type { Metadata } from "next"
import { getSkills } from "@/lib/actions/content"
import type { Skill } from "@/lib/types"

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills and proficiency levels of Nadimidoddi Sachin, AI Automation Engineer.",
}

export const revalidate = 3600

const categoryColors: Record<string, { bg: string; text: string; bar: string }> = {
  "AI / ML": { bg: "bg-purple/10 border-purple/20", text: "text-purple", bar: "bg-purple" },
  "Programming": { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-300", bar: "bg-yellow-300" },
  "Backend": { bg: "bg-blue/10 border-blue/20", text: "text-blue", bar: "bg-blue" },
  "Frontend": { bg: "bg-cyan/10 border-cyan/20", text: "text-cyan", bar: "bg-cyan" },
  "DevOps": { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", bar: "bg-emerald-400" },
  "Database": { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", bar: "bg-orange-400" },
  "Tools": { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-400", bar: "bg-rose-400" },
}

const categoryAccent: Record<string, string> = {
  "AI / ML": "text-purple-300",
  "Programming": "text-yellow-300",
  "Backend": "text-blue-300",
  "Frontend": "text-cyan-300",
  "DevOps": "text-emerald-300",
  "Database": "text-orange-300",
  "Tools": "text-rose-300",
}

const categoryPills: Record<string, string> = {
  "AI / ML": "bg-purple-500/20 text-purple-200 border-purple-400/30",
  "Programming": "bg-amber-500/20 text-amber-100 border-amber-400/30",
  "Backend": "bg-blue-500/20 text-blue-100 border-blue-400/30",
  "Frontend": "bg-cyan-500/20 text-cyan-100 border-cyan-400/30",
  "Automation": "bg-violet-500/20 text-violet-100 border-violet-400/30",
  "Database": "bg-orange-500/20 text-orange-100 border-orange-400/30",
  "DevOps": "bg-emerald-500/20 text-emerald-100 border-emerald-400/30",
  "Tools": "bg-rose-500/20 text-rose-100 border-rose-400/30",
}

const categoryPriority = ["Programming", "Backend", "Frontend", "AI / ML", "Automation", "Database", "DevOps", "Tools"]

const defaultColor = { bg: "bg-primary/10 border-primary/20", text: "text-primary", bar: "bg-primary" }

function getProficiencyLabel(p: number): string {
  if (p >= 90) return "Expert"
  if (p >= 75) return "Advanced"
  if (p >= 60) return "Proficient"
  if (p >= 40) return "Intermediate"
  return "Beginner"
}

export default async function SkillsPage() {
  const skills = await getSkills()

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  const orderedCategories = Object.entries(grouped).sort(([categoryA], [categoryB]) => {
    const aIndex = categoryPriority.indexOf(categoryA)
    const bIndex = categoryPriority.indexOf(categoryB)
    if (aIndex === -1 && bIndex === -1) return categoryA.localeCompare(categoryB)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  const totalSkills = skills.length
  const avgProficiency = totalSkills > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.proficiency, 0) / totalSkills)
    : 0

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] mb-3 text-cyan-300">Expertise</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Skills &amp; <span className="text-gradient">Technologies</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A snapshot of the tools and technologies I work with daily.
          </p>
        </div>

        {totalSkills > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Technologies", value: totalSkills },
              { label: "Categories", value: Object.keys(grouped).length },
              { label: "Avg Proficiency", value: `${avgProficiency}%` },
              { label: "Expert Level", value: skills.filter((s) => s.proficiency >= 90).length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Skills will appear here once added.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {orderedCategories.map(([category, categorySkills]) => {
              const color = categoryColors[category] ?? defaultColor
              return (
                <div key={category} className={`rounded-2xl border p-6 ${color.bg}`}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className={`h-8 w-1.5 rounded-full ${color.bar}`} />
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold uppercase tracking-[0.18em] ${categoryPills[category] ?? "bg-primary/20 text-primary border-primary/30"}`}>
                      {category}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground flex items-center gap-2">
                            {skill.icon && <span>{skill.icon}</span>}
                            {skill.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getProficiencyLabel(skill.proficiency)} &middot; {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5">
                          <div className={`h-1.5 rounded-full transition-all duration-700 ${color.bar}`} style={{ width: `${skill.proficiency}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
