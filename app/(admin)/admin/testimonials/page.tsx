import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Star } from "lucide-react"

export const metadata = { title: "Testimonials | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminTestimonialsPage() {
  const supabase = await createServiceClient()
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("order_index")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{testimonials?.length ?? 0} testimonials</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/testimonials/new"><Plus className="h-4 w-4" />Add Testimonial</Link>
        </Button>
      </div>

      {!testimonials?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Star className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No testimonials yet.</p>
          <Button asChild size="sm"><Link href="/admin/testimonials/new"><Plus className="h-4 w-4 mr-2" />Add first testimonial</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" at ")}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
                <div className="flex gap-1 mt-1">
                  {t.featured && <Badge variant="blue" className="text-xs">Featured</Badge>}
                  {!t.published && <Badge variant="glass" className="text-xs">Hidden</Badge>}
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/admin/testimonials/${t.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
