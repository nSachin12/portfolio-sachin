"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/server"
import { contactFormSchema, recruiterLeadSchema } from "@/lib/validations"
import type { ContactMessage, RecruiterLead, ActionResult, PaginatedResult } from "@/lib/types"
import { sendNotificationEmail } from "@/lib/utils/mail"
import type { z } from "zod"

export async function submitContactForm(
  payload: z.infer<typeof contactFormSchema>
): Promise<ActionResult<null>> {
  const parsed = contactFormSchema.safeParse(payload)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  })

  if (error) return { success: false, error: "Failed to send message. Please try again." }

  // Best-effort email notification (never blocks the submission).
  await sendNotificationEmail({
    subject: `New contact message from ${parsed.data.name}`,
    heading: "📬 New contact message",
    rows: [
      { label: "Name", value: parsed.data.name },
      { label: "Email", value: parsed.data.email },
    ],
    message: parsed.data.message,
    replyTo: parsed.data.email,
  })

  return { success: true, data: null }
}

export async function submitRecruiterLead(
  payload: z.infer<typeof recruiterLeadSchema>
): Promise<ActionResult<null>> {
  const parsed = recruiterLeadSchema.safeParse(payload)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  const supabase = await createClient()
  const { error } = await supabase.from("recruiter_leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company,
    role: parsed.data.role,
    message: parsed.data.message,
    source: parsed.data.source,
  })

  if (error) return { success: false, error: "Failed to submit. Please try again." }

  // Best-effort email notification (never blocks the submission).
  await sendNotificationEmail({
    subject: `New lead from ${parsed.data.name}${parsed.data.company ? ` (${parsed.data.company})` : ""}`,
    heading: "🎯 New recruiter / hire-me lead",
    rows: [
      { label: "Name", value: parsed.data.name },
      { label: "Email", value: parsed.data.email },
      { label: "Company", value: parsed.data.company },
      { label: "Role", value: parsed.data.role },
      { label: "Source", value: parsed.data.source },
    ],
    message: parsed.data.message || "(no message provided)",
    replyTo: parsed.data.email,
  })

  return { success: true, data: null }
}

export async function getContactMessages(page = 1, limit = 20): Promise<PaginatedResult<ContactMessage>> {
  const supabase = await createServiceClient()
  const from = (page - 1) * limit
  const { data, count } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1)

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getRecruiterLeads(page = 1, limit = 20): Promise<PaginatedResult<RecruiterLead>> {
  const supabase = await createServiceClient()
  const from = (page - 1) * limit
  const { data, count } = await supabase
    .from("recruiter_leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1)

  return {
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function markMessageRead(id: string): Promise<ActionResult<null>> {
  const supabase = await createServiceClient()
  const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id)
  if (error) return { success: false, error: error.message }
  return { success: true, data: null }
}
