export const availabilityOptions = [
  { value: "open_to_opportunities", label: "Available for new opportunities" },
  { value: "freelance_part_time", label: "Available for freelance and part-time work" },
  { value: "not_available", label: "Not currently available" },
] as const

export type AvailabilityStatus = (typeof availabilityOptions)[number]["value"]

export function getAvailabilityStatus(value: string | null | undefined): AvailabilityStatus {
  if (availabilityOptions.some((option) => option.value === value)) {
    return value as AvailabilityStatus
  }
  if (value === "false" || value === "busy") return "not_available"
  if (value === "available" || value === "open") return "open_to_opportunities"
  return "open_to_opportunities"
}

export function getAvailabilityLabel(value: string | null | undefined): string {
  const status = getAvailabilityStatus(value)
  return availabilityOptions.find((option) => option.value === status)!.label
}