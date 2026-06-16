export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

export function formatDateRange(start: string | Date, end?: string | Date | null): string {
  const startStr = formatDateShort(start)
  if (!end) return `${startStr} – Present`
  return `${startStr} – ${formatDateShort(end)}`
}

export function formatExperienceValue(years: number, months: number): string {
  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`)
  if (parts.length === 0) return "0 months"
  return parts.join(" ")
}

export function formatExperienceDuration(start: string | Date, end?: string | Date | null, isCurrent = false): string {
  const startDate = new Date(start)
  const endDate = isCurrent ? new Date() : end ? new Date(end) : new Date()

  const totalMonths = Math.max(
    0,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
  )

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const parts: string[] = []

  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? "month" : "months"}`)

  if (parts.length === 0) return "Less than 1 month"
  return parts.join(" ")
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "…"
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
