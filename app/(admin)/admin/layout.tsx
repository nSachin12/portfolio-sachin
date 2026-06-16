import { redirect } from "next/navigation"
import { getUser } from "@/lib/actions/auth"
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar"
import { AdminHeader } from "@/components/admin/layout/AdminHeader"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect("/?auth=required")

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
