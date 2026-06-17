/**
 * Split a possibly comma-separated input into individual, trimmed, de-duplicated
 * tags — so typing "Next.js, React, Node" adds three tags instead of one.
 * De-duplication is case-insensitive and also excludes anything already present.
 */
export function splitTags(input: string, existing: string[] = []): string[] {
  const seen = new Set(existing.map((t) => t.toLowerCase()))
  const additions: string[] = []

  for (const raw of input.split(",")) {
    const value = raw.trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    additions.push(value)
  }

  return additions
}
