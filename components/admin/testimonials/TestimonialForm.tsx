"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/content"
import { testimonialSchema } from "@/lib/validations"
import type { Testimonial } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof testimonialSchema>

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!testimonial

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name ?? "",
      role: testimonial?.role ?? "",
      company: testimonial?.company ?? "",
      avatar_url: testimonial?.avatar_url ?? "",
      content: testimonial?.content ?? "",
      rating: testimonial?.rating ?? 5,
      linkedin_url: testimonial?.linkedin_url ?? "",
      featured: testimonial?.featured ?? false,
      published: testimonial?.published ?? true,
    },
  })

  const rating = Number(watch("rating")) || 0
  const featured = watch("featured")
  const published = watch("published")

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const payload = {
        name: data.name,
        role: data.role || null,
        company: data.company || null,
        avatar_url: data.avatar_url || null,
        content: data.content,
        rating: Number(data.rating),
        linkedin_url: data.linkedin_url || null,
        featured: data.featured ?? false,
        published: data.published ?? true,
      }
      const result = isEditing
        ? await updateTestimonial(testimonial.id, payload)
        : await createTestimonial(payload)
      if (result.success) {
        toast.success(isEditing ? "Testimonial updated" : "Testimonial created")
        router.push("/admin/testimonials")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!testimonial || !confirm("Delete this testimonial?")) return
    startTransition(async () => {
      const result = await deleteTestimonial(testimonial.id)
      if (result.success) {
        toast.success("Testimonial deleted")
        router.push("/admin/testimonials")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Author</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" placeholder="Jane Doe" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="CTO" {...register("role")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Acme Inc." {...register("company")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input id="linkedin_url" placeholder="https://linkedin.com/in/…" {...register("linkedin_url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input id="avatar_url" placeholder="https://…" {...register("avatar_url")} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Testimonial</h2>
        <div className="space-y-1.5">
          <Label htmlFor="content">Content *</Label>
          <Textarea id="content" rows={4} placeholder="What did they say?…" {...register("content")} />
          {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setValue("rating", n)} className="p-0.5">
                <Star className={`h-6 w-6 transition-colors ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">{rating}/5</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Visibility</h2>
        <div className="flex items-center justify-between">
          <div>
            <Label>Published</Label>
            <p className="text-xs text-muted-foreground">Show on the testimonials page</p>
          </div>
          <Switch checked={published} onCheckedChange={(v) => setValue("published", v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured</Label>
            <p className="text-xs text-muted-foreground">Show on the home page</p>
          </div>
          <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
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
