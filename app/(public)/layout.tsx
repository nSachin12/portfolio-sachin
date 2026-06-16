import { Navbar } from "@/components/public/layout/Navbar"
import Footer from "@/components/public/layout/Footer"
import { AIChatWidget } from "@/components/public/chat/AIChatWidget"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <AIChatWidget />
    </>
  )
}
