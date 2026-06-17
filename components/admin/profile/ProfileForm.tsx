"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProfile, updateProfile, uploadProfileAvatar } from "@/lib/actions/profile"
import { profileSchema, type ProfileValues } from "@/lib/validations"
import { compressImage } from "@/lib/utils/image"
import type { Profile } from "@/lib/types"

interface ProfileFormProps {
  profile: Profile | null
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarFileName, setAvatarFileName] = useState("")

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      title: profile?.title ?? "",
      tagline: profile?.tagline ?? "",
      bio: profile?.bio ?? "",
      location: profile?.location ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      availability: profile?.availability ?? "available",
      years_of_exp: profile?.years_of_exp ?? 0,
      months_of_exp: profile?.months_of_exp ?? 0,
      github_url: profile?.github_url ?? "",
      linkedin_url: profile?.linkedin_url ?? "",
      twitter_url: profile?.twitter_url ?? "",
    },
  })

  const availability = watch("availability")

  function onSubmit(data: ProfileValues) {
    const avatarFile = avatarInputRef.current?.files?.[0] ?? null

    startTransition(async () => {
      let avatarUrl = profile?.avatar_url ?? null

      if (avatarFile) {
        const optimized = await compressImage(avatarFile, { maxDimension: 800, quality: 0.85 })
        const formData = new FormData()
        formData.set("file", optimized)

        const uploadResult = await uploadProfileAvatar(formData)
        if (!uploadResult.success) {
          toast.error(uploadResult.error)
          return
        }

        avatarUrl = uploadResult.data.avatar_url
      }

      const payload = {
        ...data,
        avatar_url: avatarUrl,
      }

      const result = profile
        ? await updateProfile(profile.id, payload)
        : await createProfile(payload)

      if (result.success) {
        toast.success(profile ? "Profile updated" : "Profile created")
        if (avatarInputRef.current) avatarInputRef.current.value = ""
        setAvatarFileName("")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-foreground">Personal Information</h2>

        <div className="space-y-3">
          <Label>Profile Photo</Label>
          <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-background/40 p-4 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-card shrink-0">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.full_name} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-primary/40">
                  {profile?.full_name?.[0] ?? "S"}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label
                htmlFor="avatar_file"
                className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Choose image
              </label>
              <input
                ref={avatarInputRef}
                id="avatar_file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatarFileName(e.target.files?.[0]?.name ?? "")}
              />
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP or GIF. Max 5MB.</p>
              {avatarFileName && <p className="text-xs text-foreground">Selected: {avatarFileName}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" placeholder="One-line personal brand statement…" {...register("tagline")} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" rows={5} placeholder="Tell your story…" {...register("bio")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="City, Country" {...register("location")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="years_of_exp">Years of Experience</Label>
            <Input id="years_of_exp" type="number" min={0} max={50} {...register("years_of_exp", { valueAsNumber: true })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="months_of_exp">Months of Experience</Label>
            <Input id="months_of_exp" type="number" min={0} max={11} {...register("months_of_exp", { valueAsNumber: true })} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
          </div>

          <div className="space-y-1.5">
            <Label>Availability</Label>
            <Select value={availability} onValueChange={(v) => setValue("availability", v as "available" | "busy" | "open")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="open">Open to opportunities</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Social Links</h2>
        {[
          { id: "github_url", label: "GitHub URL" },
          { id: "linkedin_url", label: "LinkedIn URL" },
          { id: "twitter_url", label: "Twitter / X URL" },
        ].map((field) => (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} placeholder="https://…" {...register(field.id as keyof ProfileValues)} />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Profile
      </Button>
    </form>
  )
}
