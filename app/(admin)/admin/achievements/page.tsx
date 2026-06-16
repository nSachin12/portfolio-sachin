import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trophy } from "lucide-react"

export const metadata = { title: "Achievements | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminAchievementsPage() {
  const supabase = await createServiceClient()
  const { data: achievements } = await supabase.from("achievements").select("*").order("order_index")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{achievements?.length ?? 0} achievements</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/achievements/new"><Plus className="h-4 w-4" />Add Achievement</Link>
        </Button>
      </div>

      {!achievements?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Trophy className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No achievements yet.</p>
          <Button asChild size="sm"><Link href="/admin/achievements/new"><Plus className="h-4 w-4 mr-2" />Add first achievement</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {achievements.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.organization}</p>
                <Badge variant="glass" className="text-xs mt-1 capitalize">{a.category}</Badge>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/admin/achievements/${a.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
