"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { AdminLoginModal } from "@/components/modals/AdminLoginModal"
import { useAdminTrigger } from "@/hooks/useAdminTrigger"
import { useScrolled } from "@/hooks/useScrolled"

const navLinks = [
  { label: "About", href: "/about", activeClass: "text-blue-400", hoverClass: "hover:text-blue-400" },
  { label: "Experience", href: "/experience", activeClass: "text-purple-400", hoverClass: "hover:text-purple-400" },
  { label: "Projects", href: "/projects", activeClass: "text-cyan-400", hoverClass: "hover:text-cyan-400" },
  { label: "Skills", href: "/skills", activeClass: "text-emerald-400", hoverClass: "hover:text-emerald-400" },
  { label: "Resume", href: "/resume", activeClass: "text-amber-400", hoverClass: "hover:text-amber-400" },
  { label: "Blog", href: "/blog", activeClass: "text-orange-400", hoverClass: "hover:text-orange-400" },
  { label: "Contact", href: "/contact", activeClass: "text-pink-400", hoverClass: "hover:text-pink-400" },
]

export function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled(20)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)

  const openAdminModal = useCallback(() => setAdminModalOpen(true), [])
  const { handleLogoClick } = useAdminTrigger({ onTrigger: openAdminModal })

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          "bg-background/95 backdrop-blur-xl border-b border-border/50",
          scrolled && "shadow-lg shadow-black/20"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-10 lg:px-16">
          {/* Logo — navigates home; rapid clicks still trigger admin modal */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group shrink-0 focus:outline-none"
            aria-label="Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-foreground tracking-tight whitespace-nowrap">
              Nadimidoddi <span className="text-primary">Sachin</span>
            </span>
          </Link>

          {/* Desktop nav — stretches to fill the available space, links evenly distributed */}
          <div className="hidden md:flex flex-1 items-center justify-evenly px-4 lg:px-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-md whitespace-nowrap",
                    isActive
                      ? `${link.activeClass} drop-shadow-sm`
                      : `text-foreground/60 ${link.hoverClass}`
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md bg-white/5 border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
            <Button asChild size="sm" variant="glow" className="hidden md:inline-flex">
              <Link href="/hire-me">Hire Me</Link>
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                        isActive
                          ? `bg-white/5 border border-white/10 ${link.activeClass}`
                          : `text-foreground/60 ${link.hoverClass} hover:bg-white/5`
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
                <div className="pt-2">
                  <Button asChild size="sm" variant="glow" className="w-full">
                    <Link href="/hire-me" onClick={() => setMobileOpen(false)}>
                      Hire Me
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AdminLoginModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </>
  )
}
