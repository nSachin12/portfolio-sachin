import { notFound } from "next/navigation"
import { getExperienceById } from "@/lib/actions/content"
import { ExperienceForm } from "@/components/admin/experience/ExperienceForm"

export const metadata = { title: "Edit Experience | Admin" }

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getExperienceById(id)
  if (!experience) notFound()
  return <div className="max-w-3xl"><ExperienceForm experience={experience} /></div>
}
