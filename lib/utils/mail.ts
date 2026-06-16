import "server-only"
import nodemailer from "nodemailer"

/**
 * Sends notification emails via Gmail SMTP.
 *
 * Required env vars (set in .env.local):
 *   GMAIL_USER             — the Gmail address that sends the mail
 *   GMAIL_APP_PASSWORD     — a Gmail "App Password" (NOT your normal password)
 *   NOTIFY_EMAIL           — where notifications are delivered (defaults to GMAIL_USER)
 *
 * If the env vars are missing, sending is skipped silently so the public form
 * still succeeds — notifications are best-effort, never blocking.
 */

function getTransport() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) return null

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  })
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

type NotifyFields = {
  subject: string
  heading: string
  rows: Array<{ label: string; value: string | null | undefined }>
  message: string
  replyTo?: string | null
}

/**
 * Send a notification email. Best-effort: returns false on any failure (and
 * logs it) instead of throwing, so callers never break the user's submission.
 */
export async function sendNotificationEmail(fields: NotifyFields): Promise<boolean> {
  const transport = getTransport()
  if (!transport) {
    console.warn("[mail] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping notification email")
    return false
  }

  const from = process.env.GMAIL_USER as string
  const to = process.env.NOTIFY_EMAIL || from

  const rowsHtml = fields.rows
    .filter((row) => row.value)
    .map(
      (row) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;font-size:13px;">${escapeHtml(row.label)}</td><td style="padding:4px 0;color:#111827;font-size:13px;font-weight:500;">${escapeHtml(row.value as string)}</td></tr>`,
    )
    .join("")

  const html = `
  <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;">
    <h2 style="color:#111827;font-size:18px;margin:0 0 12px;">${escapeHtml(fields.heading)}</h2>
    <table style="border-collapse:collapse;margin-bottom:16px;">${rowsHtml}</table>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;color:#111827;font-size:14px;white-space:pre-wrap;">${escapeHtml(fields.message)}</div>
    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Sent from your portfolio website.</p>
  </div>`

  try {
    await transport.sendMail({
      from: `"Portfolio" <${from}>`,
      to,
      replyTo: fields.replyTo || undefined,
      subject: fields.subject,
      html,
    })
    return true
  } catch (error) {
    console.error("[mail] Failed to send notification email:", error)
    return false
  }
}
