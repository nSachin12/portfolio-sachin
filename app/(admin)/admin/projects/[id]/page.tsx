import { notFound } from "next/navigation"
import { createServiceClient } from "@/lib/supabase/server"
import { ProjectForm } from "@/components/admin/projects/ProjectForm"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Edit Project | Admin" }

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServiceClient()
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (!project) notFound()

  return (
    <div className="max-w-3xl">
      <ProjectForm project={project} />
    </div>
  )
}
