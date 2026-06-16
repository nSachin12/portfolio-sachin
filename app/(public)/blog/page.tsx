import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Clock, ArrowRight, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPublishedBlogs } from "@/lib/actions/blog"
import { formatDate } from "@/lib/utils/format"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on AI, automation, and engineering by Nadimidoddi Sachin.",
}
export const revalidate = 3600

export default async function BlogPage() {
  const { data: posts } = await getPublishedBlogs({ page: 1, limit: 24 })

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-20">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Writing</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on AI, automation, and engineering.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No posts published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="relative h-44 bg-gradient-to-br from-primary/10 via-purple/10 to-cyan/10 overflow-hidden">
                  {post.cover_image_url ? (
                    <Image src={post.cover_image_url} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                  )}
                  {post.category && (
                    <div className="absolute top-3 left-3"><Badge variant="blue" className="text-xs">{post.category}</Badge></div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-6 gap-2">
                  <h2 className="font-semibold text-foreground text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}

                  <div className="flex items-center gap-3 mt-auto pt-3 text-xs text-muted-foreground">
                    {post.published_at && <span>{formatDate(post.published_at)}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.reading_time} min read</span>
                    <span className="ml-auto flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read<ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
