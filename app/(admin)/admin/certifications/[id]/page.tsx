import { notFound } from "next/navigation"
import { getCertificationById } from "@/lib/actions/content"
import { CertificationForm } from "@/components/admin/certifications/CertificationForm"

export const metadata = { title: "Edit Certification | Admin" }

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const certification = await getCertificationById(id)
  if (!certification) notFound()
  return <div className="max-w-3xl"><CertificationForm certification={certification} /></div>
}
