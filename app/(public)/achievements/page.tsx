import type { Metadata } from "next"
import { Trophy, ExternalLink, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAchievements } from "@/lib/actions/content"

export const metadata: Metadata = {
  title: "Achievements",
  description: "Awards, recognitions, and achievements of Nadimidoddi Sachin, AI Automation Engineer.",
}

export const revalidate = 3600

const categoryStyles: Record<string, "blue" | "purple" | "cyan" | "green" | "glass"> = {
  Award: "blue",
  Competition: "purple",
  Internship: "cyan",
  Recognition: "green",
  Publication: "glass",
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export default async function AchievementsPage() {
  const achievements = await getAchievements()

  const grouped = achievements.reduce<Record<string, typeof achievements>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = []
    acc[a.category].push(a)
    return acc
  }, {})

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Recognition</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Awards &amp; <span className="text-gradient">Achievements</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Milestones, recognitions, and accomplishments throughout my career.
          </p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Achievements will appear here once added.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{category}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{items.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((achievement) => (
                    <div key={achievement.id} className="rounded-2xl border border-border bg-card p-6 space-y-3 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-foreground text-sm leading-tight">{achievement.title}</h3>
                            <Badge variant={categoryStyles[category] ?? "glass"} className="text-xs shrink-0">{category}</Badge>
                          </div>
                          {achievement.organization && <p className="text-xs text-primary mt-1">{achievement.organization}</p>}
                        </div>
                      </div>

                      {achievement.description && <p className="text-xs text-muted-foreground leading-relaxed">{achievement.description}</p>}

                      <div className="flex items-center justify-between">
                        {achievement.date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{formatDate(achievement.date)}
                          </p>
                        )}
                        {achievement.url && (
                          <a href={achievement.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            <ExternalLink className="h-3 w-3" />View
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
