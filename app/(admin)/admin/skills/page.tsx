import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export const metadata = { title: "Skills | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminSkillsPage() {
  const supabase = await createServiceClient()
  const { data: skills } = await supabase.from("skills").select("*").order("category").order("order_index")
  type Skill = NonNullable<typeof skills>[number]
  const grouped = (skills ?? []).reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{skills?.length ?? 0} skills</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/skills/new"><Plus className="h-4 w-4" />Add Skill</Link>
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No skills added yet.</p>
          <Button asChild size="sm"><Link href="/admin/skills/new"><Plus className="h-4 w-4 mr-2" />Add your first skill</Link></Button>
        </div>
      ) : (
        Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category} className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">{category}</h3>
            {catSkills?.map((skill) => (
              <div key={skill.id} className="flex items-center gap-4">
                <span className="text-sm text-foreground w-32 shrink-0">{skill.name}</span>
                <Progress value={skill.proficiency} className="flex-1 h-1.5" />
                <span className="text-xs text-muted-foreground w-10 text-right">{skill.proficiency}%</span>
                <Button asChild variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <Link href={`/admin/skills/${skill.id}`}><Pencil className="h-3 w-3" /></Link>
                </Button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
