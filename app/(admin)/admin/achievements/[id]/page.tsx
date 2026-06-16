import { notFound } from "next/navigation"
import { getAchievementById } from "@/lib/actions/content"
import { AchievementForm } from "@/components/admin/achievements/AchievementForm"

export const metadata = { title: "Edit Achievement | Admin" }

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const achievement = await getAchievementById(id)
  if (!achievement) notFound()
  return <div className="max-w-3xl"><AchievementForm achievement={achievement} /></div>
}
