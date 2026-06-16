"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "@/lib/actions/contact"
import { contactFormSchema, type ContactFormValues } from "@/lib/validations"

export function ContactForm() {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      const result = await submitContactForm(data)
      if (result.success) {
        toast.success("Message sent! I'll get back to you soon.")
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
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Your company (optional)" {...register("company")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role">Your Role</Label>
          <Input id="role" placeholder="CTO, Founder, Recruiter…" {...register("role")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell me about your project or how I can help…"
          rows={5}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full gap-2" variant="glow" size="lg">
        {isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
        ) : (
          <><Send className="h-4 w-4" />Send Message</>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        I read every message and respond within 24 hours
      </p>
    </form>
  )
}
