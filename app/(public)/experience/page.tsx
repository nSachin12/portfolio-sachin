import type { Metadata } from "next"
import { MapPin, ExternalLink, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getExperiences } from "@/lib/actions/content"
import { formatExperienceDuration, formatDateShort } from "@/lib/utils/format"

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience and career timeline of Nadimidoddi Sachin, AI Automation Engineer.",
}

export const revalidate = 3600

export default async function ExperiencePage() {
  const experiences = await getExperiences()

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-10 lg:px-16 pt-24 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Career</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            My <span className="text-gradient">Experience</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A timeline of roles, projects, and the impact I&apos;ve made along the way.
          </p>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Experience entries will appear here once added.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden sm:block" />
            <div className="space-y-10">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative sm:pl-16 group">
                  {exp.company_logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={exp.company_logo}
                      alt={`${exp.company} logo`}
                      className="absolute left-6 top-4 hidden sm:block h-14 w-14 -translate-x-1/2 rounded-full border border-border bg-background object-contain object-center p-1 shadow-md"
                    />
                  ) : (
                    <div className="absolute left-6 top-6 hidden sm:flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background -translate-x-1/2 group-hover:bg-primary transition-colors duration-200">
                      {exp.is_current && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {exp.company_url ? (
                            <a href={exp.company_url} target="_blank" rel="noopener noreferrer" className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                              {exp.company}<ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-primary font-medium text-sm">{exp.company}</span>
                          )}
                          {exp.location && (
                            <span className="text-muted-foreground text-xs flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{exp.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateShort(exp.start_date)} &ndash; {exp.is_current || !exp.end_date ? "Present" : formatDateShort(exp.end_date)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground/60">
                          {formatExperienceDuration(exp.start_date, exp.end_date, exp.is_current)}
                        </span>
                        {exp.is_current && <Badge variant="green" className="text-xs px-2 py-0">Current</Badge>}
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{exp.description}</p>
                    )}

                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-1.5 mb-4">
                        {exp.responsibilities.map((r, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-1 shrink-0">&#9658;</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="glass" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
