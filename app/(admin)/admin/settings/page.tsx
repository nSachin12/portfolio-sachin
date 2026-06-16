import { getAllSettings } from "@/lib/actions/settings"
import { SettingsForm } from "@/components/admin/settings/SettingsForm"

export const metadata = { title: "Settings | Admin" }
export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const result = await getAllSettings()
  const settings = result.success ? result.data : []

  return (
    <div className="max-w-2xl space-y-6">
      <SettingsForm settings={settings} />
    </div>
  )
}
