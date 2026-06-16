import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, MapPin, Calendar } from "lucide-react"
import { formatDateRange, formatExperienceDuration } from "@/lib/utils/format"

export const metadata = { title: "Experience | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminExperiencePage() {
  const supabase = await createServiceClient()
  const { data: experiences } = await supabase
    .from("experience")
    .select("*")
    .order("order_index")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{experiences?.length ?? 0} positions</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/experience/new"><Plus className="h-4 w-4" />Add Experience</Link>
        </Button>
      </div>

      {!experiences?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No experience added yet.</p>
          <Button asChild size="sm"><Link href="/admin/experience/new"><Plus className="h-4 w-4 mr-2" />Add first position</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              {exp.company_logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exp.company_logo}
                  alt={`${exp.company} logo`}
                  className="h-11 w-11 shrink-0 rounded-full border border-border bg-background object-contain object-center p-0.5"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-[9px] text-muted-foreground">
                  Logo
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{exp.role}</p>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  {exp.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exp.location}</span>}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exp.is_current ? formatDateRange(exp.start_date) : formatDateRange(exp.start_date, exp.end_date)}
                  </span>
                  {exp.is_current && <Badge variant="green" className="text-xs">Current</Badge>}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground/70">
                  {formatExperienceDuration(exp.start_date, exp.end_date, exp.is_current)}
                </p>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/admin/experience/${exp.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
