import { getProfile } from "@/lib/actions/profile"
import { ProfileForm } from "@/components/admin/profile/ProfileForm"

export const metadata = { title: "Profile | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminProfilePage() {
  const profile = await getProfile()

  return (
    <div className="max-w-2xl">
      <ProfileForm profile={profile} />
    </div>
  )
}
