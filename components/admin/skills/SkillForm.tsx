"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createSkill, updateSkill, deleteSkill } from "@/lib/actions/content"
import { skillSchema } from "@/lib/validations"
import type { Skill } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof skillSchema>

const CATEGORIES = ["AI / ML", "Backend", "Frontend", "Programming", "DevOps", "Database", "Tools", "Other"]

export function SkillForm({ skill }: { skill?: Skill }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!skill

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "AI / ML",
      proficiency: skill?.proficiency ?? 80,
      icon: skill?.icon ?? "",
    },
  })

  const proficiency = watch("proficiency")
  const category = watch("category")

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = {
        name: data.name,
        category: data.category,
        proficiency: Number(data.proficiency),
        icon: data.icon || null,
      }
      const result = isEditing ? await updateSkill(skill.id, payload) : await createSkill(payload)
      if (result.success) {
        toast.success(isEditing ? "Skill updated" : "Skill created")
        router.push("/admin/skills")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!skill || !confirm("Delete this skill?")) return
    startTransition(async () => {
      const result = await deleteSkill(skill.id)
      if (result.success) {
        toast.success("Skill deleted")
        router.push("/admin/skills")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Skill Details</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="e.g. Python, LangChain" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setValue("category", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-background">{c}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="proficiency">Proficiency: {proficiency}%</Label>
          <input
            id="proficiency"
            type="range"
            min={0}
            max={100}
            step={5}
            {...register("proficiency", { valueAsNumber: true })}
            className="w-full accent-primary"
          />
          {errors.proficiency && <p className="text-xs text-destructive">{errors.proficiency.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="icon">Icon (optional)</Label>
          <Input id="icon" placeholder="lucide icon name or emoji" {...register("icon")} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update Skill" : "Create Skill"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
        {isEditing && (
          <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={isPending} className="gap-2">
            <Trash2 className="h-4 w-4" />Delete
          </Button>
        )}
      </div>
    </form>
  )
}
