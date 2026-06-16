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
import { createCertification, updateCertification, deleteCertification } from "@/lib/actions/content"
import { certificationSchema } from "@/lib/validations"
import type { Certification } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof certificationSchema>

function toDateInput(d: string | null | undefined): string {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 10)
}

export function CertificationForm({ certification }: { certification?: Certification }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [skillInput, setSkillInput] = useState("")
  const isEditing = !!certification

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: certification?.title ?? "",
      issuer: certification?.issuer ?? "",
      description: certification?.description ?? "",
      issue_date: toDateInput(certification?.issue_date),
      expiry_date: toDateInput(certification?.expiry_date),
      credential_id: certification?.credential_id ?? "",
      credential_url: certification?.credential_url ?? "",
      skills: certification?.skills ?? [],
      featured: certification?.featured ?? false,
    },
  })

  const skills = watch("skills") ?? []
  const featured = watch("featured")

  function addSkill() {
    const v = skillInput.trim()
    if (!v || skills.includes(v)) return
    setValue("skills", [...skills, v])
    setSkillInput("")
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = {
        title: data.title,
        issuer: data.issuer,
        description: data.description || null,
        issue_date: data.issue_date || null,
        expiry_date: data.expiry_date || null,
        credential_id: data.credential_id || null,
        credential_url: data.credential_url || null,
        certificate_url: certification?.certificate_url ?? null,
        image_url: certification?.image_url ?? null,
        skills: data.skills ?? [],
        featured: data.featured ?? false,
      }
      const result = isEditing
        ? await updateCertification(certification.id, payload)
        : await createCertification(payload)
      if (result.success) {
        toast.success(isEditing ? "Certification updated" : "Certification created")
        router.push("/admin/certifications")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!certification || !confirm("Delete this certification?")) return
    startTransition(async () => {
      const result = await deleteCertification(certification.id)
      if (result.success) {
        toast.success("Certification deleted")
        router.push("/admin/certifications")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Certification Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="AWS Certified Machine Learning" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issuer">Issuer *</Label>
            <Input id="issuer" placeholder="Amazon Web Services" {...register("issuer")} />
            {errors.issuer && <p className="text-xs text-destructive">{errors.issuer.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="credential_id">Credential ID</Label>
            <Input id="credential_id" placeholder="ABC-123" {...register("credential_id")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="issue_date">Issue Date</Label>
            <Input id="issue_date" type="date" {...register("issue_date")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input id="expiry_date" type="date" {...register("expiry_date")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="credential_url">Credential URL</Label>
            <Input id="credential_url" placeholder="https://…" {...register("credential_url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Skills</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill…"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div key={s} className="flex items-center gap-1">
                <Badge variant="glass">{s}</Badge>
                <button type="button" onClick={() => setValue("skills", skills.filter((x) => x !== s))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured</Label>
            <p className="text-xs text-muted-foreground">Highlight at the top of the certifications page</p>
          </div>
          <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
        </div>
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
