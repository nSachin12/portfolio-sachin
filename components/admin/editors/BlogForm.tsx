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
import { RichTextEditor } from "@/components/admin/editors/RichTextEditor"
import { createBlog, updateBlog, deleteBlog } from "@/lib/actions/blog"
import { blogSchema } from "@/lib/validations"
import { generateSlug } from "@/lib/utils/format"
import { splitTags } from "@/lib/utils/tags"
import type { Blog } from "@/lib/types"
import type { z } from "zod"

type FormValues = z.input<typeof blogSchema>

export function BlogForm({ blog }: { blog?: Blog }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [tagInput, setTagInput] = useState("")
  const isEditing = !!blog

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      slug: blog?.slug ?? "",
      excerpt: blog?.excerpt ?? "",
      content: blog?.content ?? "",
      cover_image_url: blog?.cover_image_url ?? "",
      category: blog?.category ?? "",
      tags: blog?.tags ?? [],
      published: blog?.published ?? false,
      meta_title: blog?.meta_title ?? "",
      meta_description: blog?.meta_description ?? "",
    },
  })

  const tags = watch("tags") ?? []
  const content = watch("content") ?? ""
  const published = watch("published")

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue("title", e.target.value)
    if (!isEditing) setValue("slug", generateSlug(e.target.value))
  }

  function addTag() {
    const additions = splitTags(tagInput, tags)
    if (additions.length === 0) return
    setValue("tags", [...tags, ...additions])
    setTagInput("")
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = isEditing ? await updateBlog(blog.id, data) : await createBlog(data)
      if (result.success) {
        toast.success(isEditing ? "Post updated" : "Post created")
        router.push("/admin/blog")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete() {
    if (!blog || !confirm("Delete this post? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteBlog(blog.id)
      if (result.success) {
        toast.success("Post deleted")
        router.push("/admin/blog")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Post</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" placeholder="My Post Title" {...register("title")} onChange={handleTitleChange} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" placeholder="my-post-title" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="AI, Tutorial…" {...register("category")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input id="cover_image_url" placeholder="https://…" {...register("cover_image_url")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} placeholder="Short summary shown in cards…" {...register("excerpt")} />
          </div>
        </div>
      </div>

      {/* Content editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <RichTextEditor value={content} onChange={(html) => setValue("content", html)} />
      </div>

      {/* Tags */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Tags</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <div key={t} className="flex items-center gap-1">
                <Badge variant="glass">{t}</Badge>
                <button type="button" onClick={() => setValue("tags", tags.filter((x) => x !== t))} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">SEO</h2>
        <div className="space-y-1.5">
          <Label htmlFor="meta_title">Meta Title</Label>
          <Input id="meta_title" placeholder="≤ 70 chars" {...register("meta_title")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea id="meta_description" rows={2} placeholder="≤ 160 chars" {...register("meta_description")} />
        </div>
      </div>

      {/* Visibility */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Published</Label>
            <p className="text-xs text-muted-foreground">Make this post publicly visible</p>
          </div>
          <Switch checked={published} onCheckedChange={(v) => setValue("published", v)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEditing ? "Update Post" : "Create Post"}
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
