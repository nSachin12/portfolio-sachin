"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { createExperience, updateExperience, deleteExperience } from "@/lib/actions/content"
import { experienceSchema } from "@/lib/validations"
import { splitTags } from "@/lib/utils/tags"
import type { Experience } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof experienceSchema>

function toDateInput(d: string | null | undefined): string {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 10)
}

export function ExperienceForm({ experience }: { experience?: Experience }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [respInput, setRespInput] = useState("")
  const [techInput, setTechInput] = useState("")
  const isEditing = !!experience

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      description: experience?.description ?? "",
      responsibilities: experience?.responsibilities ?? [],
      technologies: experience?.technologies ?? [],
      company_logo: experience?.company_logo ?? "",
      company_url: experience?.company_url ?? "",
      location: experience?.location ?? "",
      start_date: toDateInput(experience?.start_date),
      end_date: toDateInput(experience?.end_date),
      is_current: experience?.is_current ?? false,
    },
  })

  const responsibilities = watch("responsibilities") ?? []
  const technologies = watch("technologies") ?? []
  const isCurrent = watch("is_current")
  const companyLogo = watch("company_logo")?.trim()

  function addResp() {
    const v = respInput.trim()
    if (!v) return
    setValue("responsibilities", [...responsibilities, v])
    setRespInput("")
  }
  function addTech() {
    const additions = splitTags(techInput, technologies)
    if (additions.length === 0) return
    setValue("technologies", [...technologies, ...additions])
    setTechInput("")
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = {
        company: data.company,
        role: data.role,
        description: data.description || null,
        responsibilities: data.responsibilities ?? [],
        technologies: data.technologies ?? [],
        company_logo: data.company_logo || null,
        company_url: data.company_url || null,
        location: data.location || null,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date || null,
        is_current: data.is_current ?? false,
      }
      const result = isEditing
        ? await updateExperience(experience.id, payload)
        : await createExperience(payload)
      if (result.success) {
        toast.success(isEditing ? "Experience updated" : "Experience created")
        router.push("/admin/experience")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!experience || !confirm("Delete this experience entry?")) return
    startTransition(async () => {
      const result = await deleteExperience(experience.id)
      if (result.success) {
        toast.success("Experience deleted")
        router.push("/admin/experience")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Role</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="role">Role / Title *</Label>
            <Input id="role" placeholder="AI Engineer" {...register("role")} />
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" placeholder="Acme Inc." {...register("company")} />
            {errors.company && <p className="text-xs text-destructive">{errors.company.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="Remote / City" {...register("location")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company_url">Company URL</Label>
            <Input id="company_url" placeholder="https://…" {...register("company_url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company_logo">Company Logo URL</Label>
            <div className="flex items-center gap-3">
              {companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={companyLogo}
                  alt="Company logo preview"
                  className="h-14 w-14 shrink-0 rounded-full border border-border bg-background object-contain object-center p-1"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-[10px] text-muted-foreground">
                  Logo
                </div>
              )}
              <Input id="company_logo" placeholder="https://…/logo.png" {...register("company_logo")} />
            </div>
            <p className="text-xs text-muted-foreground">Shown on the timeline in place of the dot. Square images look best.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="start_date">Start Date *</Label>
            <Input id="start_date" type="date" {...register("start_date")} />
            {errors.start_date && <p className="text-xs text-destructive">{errors.start_date.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end_date">End Date</Label>
            <Input id="end_date" type="date" disabled={isCurrent} {...register("end_date")} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Current Role</Label>
            <p className="text-xs text-muted-foreground">I currently work here</p>
          </div>
          <Switch checked={isCurrent} onCheckedChange={(v) => setValue("is_current", v)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} placeholder="Brief summary of the role…" {...register("description")} />
        </div>
      </div>

      {/* Responsibilities */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Responsibilities</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add a responsibility…"
            value={respInput}
            onChange={(e) => setRespInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResp() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addResp}><Plus className="h-4 w-4" /></Button>
        </div>
        {responsibilities.length > 0 && (
          <ul className="space-y-2">
            {responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1">&#9658;</span>
                <span className="flex-1">{r}</span>
                <button type="button" onClick={() => setValue("responsibilities", responsibilities.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Technologies */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Technologies</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add technology…"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech}><Plus className="h-4 w-4" /></Button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <div key={t} className="flex items-center gap-1">
                <Badge variant="glass">{t}</Badge>
                <button type="button" onClick={() => setValue("technologies", technologies.filter((x) => x !== t))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
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
