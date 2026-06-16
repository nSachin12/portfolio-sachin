import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Award } from "lucide-react"

export const metadata = { title: "Certifications | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminCertificationsPage() {
  const supabase = await createServiceClient()
  const { data: certs } = await supabase.from("certifications").select("*").order("order_index")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{certs?.length ?? 0} certifications</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/certifications/new"><Plus className="h-4 w-4" />Add Certification</Link>
        </Button>
      </div>

      {!certs?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Award className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No certifications yet.</p>
          <Button asChild size="sm"><Link href="/admin/certifications/new"><Plus className="h-4 w-4 mr-2" />Add first certification</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {certs.map((cert) => (
            <div key={cert.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{cert.title}</p>
                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                <div className="flex gap-1 mt-1.5">
                  {cert.featured && <Badge variant="blue" className="text-xs">Featured</Badge>}
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/admin/certifications/${cert.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
