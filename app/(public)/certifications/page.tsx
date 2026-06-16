import type { Metadata } from "next"
import { Award, ExternalLink, Calendar, BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCertifications } from "@/lib/actions/content"

export const metadata: Metadata = {
  title: "Certifications",
  description: "Professional certifications and credentials of Nadimidoddi Sachin, AI Automation Engineer.",
}

export const revalidate = 3600

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

type CertType = Awaited<ReturnType<typeof getCertifications>>[number]

function CertCard({ cert, featured = false }: { cert: CertType; featured?: boolean }) {
  return (
    <div className={`rounded-2xl border bg-card p-6 space-y-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${featured ? "border-primary/30 bg-primary/5" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <BadgeCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{cert.title}</h3>
          <p className="text-xs text-primary mt-1">{cert.issuer}</p>
        </div>
      </div>

      {cert.description && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{cert.description}</p>}

      <div className="space-y-1">
        {cert.issue_date && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            Issued: {formatDate(cert.issue_date)}
            {cert.expiry_date && ` · Expires: ${formatDate(cert.expiry_date)}`}
          </p>
        )}
        {cert.credential_id && <p className="text-xs text-muted-foreground font-mono">ID: {cert.credential_id}</p>}
      </div>

      {cert.skills && cert.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {cert.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="glass" className="text-xs">{skill}</Badge>
          ))}
        </div>
      )}

      {cert.credential_url && (
        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <ExternalLink className="h-3 w-3" />Verify Certificate
        </a>
      )}
    </div>
  )
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()
  const featured = certifications.filter((c) => c.featured)
  const rest = certifications.filter((c) => !c.featured)

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Credentials</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Certifications &amp; <span className="text-gradient">Credentials</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Verified qualifications from industry-leading platforms and institutions.
          </p>
        </div>

        {certifications.length === 0 ? (
          <div className="text-center py-20">
            <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Certifications will appear here once added.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">Featured</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((cert) => <CertCard key={cert.id} cert={cert} featured />)}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                {featured.length > 0 && <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">All Certifications</h2>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((cert) => <CertCard key={cert.id} cert={cert} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
