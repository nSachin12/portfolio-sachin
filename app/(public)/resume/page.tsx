import type { Metadata } from "next"
import { FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getActiveResume, getExperiences, getSkills, getCertifications } from "@/lib/actions/content"
import { getProfile } from "@/lib/actions/profile"

export const metadata: Metadata = {
  title: "Resume",
  description: "Download the resume of Nadimidoddi Sachin, AI Automation Engineer.",
}

export const revalidate = 3600

function formatDate(d: string | null): string {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default async function ResumePage() {
  const [resume, profile, experiences, skills, certifications] = await Promise.all([
    getActiveResume(),
    getProfile(),
    getExperiences(),
    getSkills(),
    getCertifications(),
  ])

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Resume</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            My <span className="text-gradient">Resume</span>
          </h1>

          {resume ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                <Button variant="glow" size="lg" className="gap-2">
                  <Eye className="h-4 w-4" />View PDF
                </Button>
              </a>
              <a href={resume.file_url} download={resume.file_name}>
                <Button variant="glass" size="lg" className="gap-2">
                  <Download className="h-4 w-4" />Download PDF
                </Button>
              </a>
            </div>
          ) : (
            <p className="text-muted-foreground mt-4 text-sm">Resume PDF not uploaded yet — preview below.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border bg-primary/5 p-8">
            <h2 className="text-3xl font-bold text-foreground">{profile?.full_name ?? "Nadimidoddi Sachin"}</h2>
            <p className="text-primary font-medium mt-1">{profile?.title ?? "AI Automation Engineer"}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-muted-foreground">
              {profile?.email && <span>{profile.email}</span>}
              {profile?.location && <span>{profile.location}</span>}
              {profile?.github_url && <a href={profile.github_url} className="text-primary hover:underline">GitHub</a>}
              {profile?.linkedin_url && <a href={profile.linkedin_url} className="text-primary hover:underline">LinkedIn</a>}
            </div>

            {profile?.bio && (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-3xl line-clamp-3">{profile.bio}</p>
            )}
          </div>

          <div className="p-8 space-y-8">
            {experiences.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2 mb-4">Experience</h3>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-foreground">{exp.role}</p>
                          <p className="text-sm text-primary">{exp.company}</p>
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {formatDate(exp.start_date)} &ndash; {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </p>
                      </div>
                      {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.responsibilities.slice(0, 3).map((r, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <span className="text-primary shrink-0">&#9658;</span>{r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {Object.keys(skillsByCategory).length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2 mb-4">Skills</h3>
                <div className="space-y-2">
                  {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                    <div key={cat} className="flex gap-3 text-sm">
                      <span className="font-medium text-foreground w-28 shrink-0">{cat}:</span>
                      <span className="text-muted-foreground">{catSkills.map((s) => s.name).join(", ")}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-border pb-2 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-start text-sm">
                      <div>
                        <span className="font-medium text-foreground">{cert.title}</span>
                        <span className="text-muted-foreground"> &middot; {cert.issuer}</span>
                      </div>
                      {cert.issue_date && <span className="text-xs text-muted-foreground shrink-0">{formatDate(cert.issue_date)}</span>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {resume && (
            <div className="border-t border-border bg-card/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                <span>{resume.file_name}</span>
                {resume.version && <span className="text-primary">v{resume.version}</span>}
              </div>
              <a href={resume.file_url} download={resume.file_name}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Download className="h-3 w-3" />Download
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
