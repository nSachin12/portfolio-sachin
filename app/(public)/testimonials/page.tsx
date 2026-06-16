import type { Metadata } from "next"
import Image from "next/image"
import { Star, Linkedin } from "lucide-react"
import { getTestimonials } from "@/lib/actions/content"

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients and colleagues say about working with Nadimidoddi Sachin.",
}

export const revalidate = 3600

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials(true)

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : null

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Social Proof</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            What People <span className="text-gradient">Say</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Feedback from clients, colleagues, and collaborators I&apos;ve had the pleasure of working with.
          </p>

          {avgRating && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${star <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">{avgRating}</span>
              <span className="text-xs text-muted-foreground">from {testimonials.length} review{testimonials.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-20">
            <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Testimonials will appear here once added.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t) => (
              <div key={t.id} className="break-inside-avoid rounded-2xl border border-border bg-card p-6 space-y-4 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                  ))}
                </div>

                <blockquote className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 shrink-0">
                      {t.avatar_url ? (
                        <Image src={t.avatar_url} alt={t.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold text-primary">{t.name[0]}</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
                    </div>
                  </div>
                  {t.linkedin_url && (
                    <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
