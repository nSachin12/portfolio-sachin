import { notFound } from "next/navigation"
import { getSkillById } from "@/lib/actions/content"
import { SkillForm } from "@/components/admin/skills/SkillForm"

export const metadata = { title: "Edit Skill | Admin" }

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skill = await getSkillById(id)
  if (!skill) notFound()
  return <div className="max-w-2xl"><SkillForm skill={skill} /></div>
}
