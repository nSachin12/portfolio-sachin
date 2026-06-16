import { getAllResumes } from "@/lib/actions/content"
import { ResumeManager } from "@/components/admin/resume/ResumeManager"

export const metadata = { title: "Resume | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminResumePage() {
  const resumes = await getAllResumes()
  return (
    <div className="max-w-3xl">
      <ResumeManager resumes={resumes} />
    </div>
  )
}
