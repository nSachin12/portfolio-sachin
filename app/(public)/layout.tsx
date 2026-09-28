import { Navbar } from "@/components/public/layout/Navbar"
import Footer from "@/components/public/layout/Footer"
import { AIChatWidget } from "@/components/public/chat/AIChatWidget"
import { getSettings } from "@/lib/actions/settings"
import { getProfile } from "@/lib/actions/profile"

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, profile] = await Promise.all([getSettings(), getProfile()])

  return (
    <>
      <Navbar showBlog={settings.show_blog !== "false"} avatarUrl={profile?.avatar_url} />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      {settings.show_chat !== "false" && <AIChatWidget />}
    </>
  )
}
