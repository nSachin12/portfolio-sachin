"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSetting } from "@/lib/actions/settings"
import type { Setting } from "@/lib/types"
import { availabilityOptions, getAvailabilityStatus } from "@/lib/utils/availability"

interface SettingsFormProps {
  settings: Setting[]
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value ?? ""]))
  )

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSaveAll() {
    startTransition(async () => {
      const updates = settings.map((s) =>
        updateSetting(s.key, values[s.key] ?? "")
      )
      const results = await Promise.all(updates)
      const hasError = results.some((r) => !r.success)
      if (hasError) {
        toast.error("Some settings failed to save")
      } else {
        toast.success("Settings saved successfully")
      }
    })
  }

  const booleanSettings = settings.filter((s) => s.type === "boolean" && s.key !== "hire_me_available")
  const stringSettings = settings.filter((s) => (s.type === "string" || s.type === "number") && s.key !== "availability_status")
  const availability = settings.find((setting) => setting.key === "availability_status")

  return (
    <div className="space-y-8">
      {/* Toggle settings */}
      {booleanSettings.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Feature Toggles</h2>
          <div className="space-y-4">
            {booleanSettings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">{setting.description ?? setting.key}</Label>
                  <p className="text-xs text-muted-foreground font-mono">{setting.key}</p>
                </div>
                <Switch
                  checked={values[setting.key] === "true"}
                  onCheckedChange={(checked) => handleChange(setting.key, String(checked))}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* String/number settings */}
      {stringSettings.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Site Configuration</h2>
          <div className="space-y-4">
            {availability && (
              <div className="space-y-1.5">
                <Label htmlFor="availability_status">Professional availability</Label>
                <Select
                  value={getAvailabilityStatus(values.availability_status)}
                  onValueChange={(value) => handleChange("availability_status", value)}
                >
                  <SelectTrigger id="availability_status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {stringSettings.map((setting) => (
              <div key={setting.key} className="space-y-1.5">
                <Label htmlFor={setting.key}>{setting.description ?? setting.key}</Label>
                <p className="text-xs text-muted-foreground font-mono">{setting.key}</p>
                <Input
                  id={setting.key}
                  value={values[setting.key] ?? ""}
                  onChange={(e) => handleChange(setting.key, e.target.value)}
                  type={setting.type === "number" ? "number" : "text"}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSaveAll} disabled={isPending} className="gap-2">
        <Save className="h-4 w-4" />
        {isPending ? "Saving…" : "Save All Settings"}
      </Button>
    </div>
  )
}
