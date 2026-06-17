import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { AdminShell } from "@/components/admin/layout/AdminShell"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/?auth=required")

  return <AdminShell>{children}</AdminShell>
}
