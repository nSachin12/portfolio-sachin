import type { Metadata } from "next"
import { Mail, Linkedin, Github, Clock } from "lucide-react"
import { ContactForm } from "@/components/public/contact/ContactForm"
import { getProfile } from "@/lib/actions/profile"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nadimidoddi Sachin — AI Automation Engineer.",
}

export default async function ContactPage() {
  const profile = await getProfile()

  const contactInfo = [
    profile?.email
      ? {
          icon: Mail,
          label: "Email",
          value: profile.email,
          href: `mailto:${profile.email}`,
        }
      : null,
    profile?.linkedin_url
      ? {
          icon: Linkedin,
          label: "LinkedIn",
          value: "Connect on LinkedIn",
          href: profile.linkedin_url,
        }
      : null,
    profile?.github_url
      ? {
          icon: Github,
          label: "GitHub",
          value: "View my work",
          href: profile.github_url,
        }
      : null,
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      href: null,
    },
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind, a question about my work, or just want to say hi? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="font-semibold text-foreground">Get in Touch</h2>
              {contactInfo.map((item) => {
                const Icon = item.icon
                const content = (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block hover:opacity-80 transition-opacity"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-border bg-card/50 p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Currently <span className="text-emerald-400 font-medium">available</span> for freelance projects and
                full-time opportunities in AI automation, LLM integration, and intelligent systems.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-semibold text-foreground text-lg mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
