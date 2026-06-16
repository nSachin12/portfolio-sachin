"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2, Trash2, Plus, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { createProject, updateProject, deleteProject, uploadProjectImage } from "@/lib/actions/projects"
import { projectSchema } from "@/lib/validations"
import { generateSlug } from "@/lib/utils/format"
import type { Project } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof projectSchema>

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [techInput, setTechInput] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const isEditing = !!project

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      slug: project?.slug ?? "",
      description: project?.description ?? "",
      overview: project?.overview ?? "",
      problem: project?.problem ?? "",
      solution: project?.solution ?? "",
      architecture: project?.architecture ?? "",
      results: project?.results ?? "",
      image_url: project?.image_url ?? "",
      category: project?.category ?? "",
      technologies: project?.technologies ?? [],
      github_url: project?.github_url ?? "",
      live_url: project?.live_url ?? "",
      featured: project?.featured ?? false,
      published: project?.published ?? true,
    },
  })

  const technologies = watch("technologies")
  const title = watch("title")
  const featured = watch("featured")
  const published = watch("published")
  const imageUrlValue = watch("image_url")
  const imagePreview = filePreview ?? (imageUrlValue || null)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setValue("title", newTitle)
    if (!isEditing) {
      setValue("slug", generateSlug(newTitle))
    }
  }

  function addTech() {
    const tech = techInput.trim()
    const techs = technologies ?? []
    if (!tech || techs.includes(tech)) return
    setValue("technologies", [...techs, tech])
    setTechInput("")
  }

  function removeTech(tech: string) {
    setValue("technologies", (technologies ?? []).filter((t) => t !== tech))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setFilePreview(file ? URL.createObjectURL(file) : null)
  }

  function onSubmit(data: FormValues) {
    const imageFile = imageInputRef.current?.files?.[0] ?? null

    startTransition(async () => {
      let imageUrl = data.image_url || null

      // If a file was chosen from the device, upload it first.
      if (imageFile) {
        const formData = new FormData()
        formData.set("file", imageFile)
        const uploadResult = await uploadProjectImage(formData)
        if (!uploadResult.success) {
          toast.error(uploadResult.error)
          return
        }
        imageUrl = uploadResult.data.image_url
      }

      const payload = {
        ...data,
        image_url: imageUrl ?? "",
        technologies: data.technologies ?? [],
        featured: data.featured ?? false,
        published: data.published ?? true,
      } as const
      const result = isEditing
        ? await updateProject(project.id, payload)
        : await createProject(payload)

      if (result.success) {
        toast.success(isEditing ? "Project updated" : "Project created")
        router.push("/admin/projects")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!project || !confirm("Delete this project? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteProject(project.id)
      if (result.success) {
        toast.success("Project deleted")
        router.push("/admin/projects")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Core fields */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Project Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="My Awesome Project"
              {...register("title")}
              onChange={handleTitleChange}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" placeholder="my-awesome-project" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="AI, Automation, Web…" {...register("category")} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              placeholder="One-paragraph description shown in cards…"
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label>Cover Image</Label>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-background/40 p-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Cover preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="image_file"
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Choose image from device
                </label>
                <input
                  ref={imageInputRef}
                  id="image_file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">PNG/JPG/WebP, up to 5MB. This shows on the public project card.</p>
                <Input placeholder="…or paste an image URL" {...register("image_url")} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input id="github_url" placeholder="https://github.com/…" {...register("github_url")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="live_url">Live URL</Label>
            <Input id="live_url" placeholder="https://…" {...register("live_url")} />
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Technologies</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add technology (e.g. Python, LangChain)…"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTech}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {(technologies ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(technologies ?? []).map((tech) => (
              <div key={tech} className="flex items-center gap-1">
                <Badge variant="glass">{tech}</Badge>
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case study */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Case Study (Optional)</h2>
        {[
          { id: "overview", label: "Overview", placeholder: "High-level overview of the project…" },
          { id: "problem", label: "Problem", placeholder: "What problem were you solving?…" },
          { id: "solution", label: "Solution", placeholder: "How did you solve it?…" },
          { id: "architecture", label: "Architecture", placeholder: "Technical architecture decisions…" },
          { id: "results", label: "Results", placeholder: "Measurable outcomes and impact…" },
        ].map((field) => (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              rows={3}
              {...register(field.id as "overview" | "problem" | "solution" | "architecture" | "results")}
            />
          </div>
        ))}
      </div>

      {/* Visibility toggles */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Visibility</h2>
        <div className="flex items-center justify-between">
          <div>
            <Label>Published</Label>
            <p className="text-xs text-muted-foreground">Show on public portfolio</p>
          </div>
          <Switch checked={published} onCheckedChange={(v) => setValue("published", v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Featured</Label>
            <p className="text-xs text-muted-foreground">Show on home page</p>
          </div>
          <Switch checked={featured} onCheckedChange={(v) => setValue("featured", v)} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
