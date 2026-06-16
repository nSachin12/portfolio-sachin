import { getRecruiterLeads } from "@/lib/actions/contact"
import { formatDate } from "@/lib/utils/format"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Clock, Mail } from "lucide-react"

export const metadata = { title: "Recruiter Leads | Admin" }
export const dynamic = "force-dynamic"

const statusColors = {
  new: "blue",
  contacted: "cyan",
  in_progress: "purple",
  closed: "glass",
} as const

export default async function LeadsPage() {
  const { data: leads, total } = await getRecruiterLeads(1, 50)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} lead{total !== 1 ? "s" : ""} total</p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No leads yet.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Recruiter inquiries from the Hire Me form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`rounded-xl border p-5 transition-colors ${
                lead.is_read ? "border-border bg-card/50" : "border-primary/20 bg-primary/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border border-border">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[lead.role, lead.company].filter(Boolean).join(" at ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!lead.is_read && <Badge variant="blue" className="text-xs">New</Badge>}
                  <Badge variant={statusColors[lead.status]} className="text-xs capitalize">
                    {lead.status.replace("_", " ")}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(lead.created_at)}
                  </span>
                </div>
              </div>
              {lead.message && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{lead.message}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Mail className="h-3 w-3" />
                  {lead.email}
                </a>
                <Badge variant="glass" className="text-xs capitalize">{lead.source}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
