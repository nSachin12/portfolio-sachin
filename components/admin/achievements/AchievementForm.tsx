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
import { Textarea } from "@/components/ui/textarea"
import { createAchievement, updateAchievement, deleteAchievement } from "@/lib/actions/content"
import { achievementSchema } from "@/lib/validations"
import type { Achievement } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof achievementSchema>

const CATEGORIES: Achievement["category"][] = [
  "Award",
  "Competition",
  "Internship",
  "Recognition",
  "Publication",
]

function toDateInput(d: string | null | undefined): string {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 10)
}

export function AchievementForm({ achievement }: { achievement?: Achievement }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!achievement

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      category: achievement?.category ?? "Award",
      date: toDateInput(achievement?.date),
      organization: achievement?.organization ?? "",
      image_url: achievement?.image_url ?? "",
      url: achievement?.url ?? "",
    },
  })

  const category = watch("category")

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = {
        title: data.title,
        description: data.description || null,
        category: data.category,
        date: data.date || null,
        organization: data.organization || null,
        image_url: data.image_url || null,
        url: data.url || null,
      }
      const result = isEditing
        ? await updateAchievement(achievement.id, payload)
        : await createAchievement(payload)
      if (result.success) {
        toast.success(isEditing ? "Achievement updated" : "Achievement created")
        router.push("/admin/achievements")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!achievement || !confirm("Delete this achievement?")) return
    startTransition(async () => {
      const result = await deleteAchievement(achievement.id)
      if (result.success) {
        toast.success("Achievement deleted")
        router.push("/admin/achievements")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Achievement Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="1st Place — National AI Hackathon" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setValue("category", e.target.value as Achievement["category"])}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-background">{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" {...register("date")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" placeholder="Issuing org / event" {...register("organization")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url">Link URL</Label>
            <Input id="url" placeholder="https://…" {...register("url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input id="image_url" placeholder="https://…" {...register("image_url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update" : "Create"}
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
