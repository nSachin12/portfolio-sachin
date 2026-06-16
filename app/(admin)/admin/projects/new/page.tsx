import { ProjectForm } from "@/components/admin/projects/ProjectForm"

export const metadata = { title: "New Project | Admin" }

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl">
      <ProjectForm />
    </div>
  )
}
