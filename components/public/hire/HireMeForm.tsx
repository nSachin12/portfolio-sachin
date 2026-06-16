"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitRecruiterLead } from "@/lib/actions/contact"
import { recruiterLeadSchema } from "@/lib/validations"
import type { z } from "zod"

type FormValues = z.input<typeof recruiterLeadSchema>

export function HireMeForm() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(recruiterLeadSchema),
    defaultValues: { source: "hire_me" },
  })

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await submitRecruiterLead({
        name: data.name,
        email: data.email,
        company: data.company,
        role: data.role,
        message: data.message,
        source: data.source ?? "hire_me",
      })
      if (result.success) {
        toast.success("Inquiry submitted! I'll review and get back to you within 24 hours.")
        reset()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="hire-name">Your Name *</Label>
          <Input id="hire-name" placeholder="Full name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hire-email">Email *</Label>
          <Input id="hire-email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hire-company">Company</Label>
          <Input id="hire-company" placeholder="Your company" {...register("company")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hire-role">Role / Opportunity</Label>
          <Input id="hire-role" placeholder="Senior AI Engineer, Freelance project…" {...register("role")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hire-message">Tell me about the opportunity</Label>
        <Textarea
          id="hire-message"
          placeholder="Describe the project, tech stack, timeline, and budget range…"
          rows={5}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <input type="hidden" {...register("source")} />

      <Button type="submit" disabled={isPending} className="w-full gap-2" variant="glow" size="lg">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</>
        ) : (
          <><Sparkles className="h-4 w-4" />Submit Inquiry</>
        )}
      </Button>
    </form>
  )
}
