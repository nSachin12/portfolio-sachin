import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Clock, ArrowLeft, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getBlogBySlug } from "@/lib/actions/blog"
import { formatDate } from "@/lib/utils/format"
import { siteConfig } from "@/config/site"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.published_at || undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)
  if (!post) notFound()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />Back to blog
        </Link>

        {post.category && <Badge variant="blue" className="mb-4">{post.category}</Badge>}

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          {post.published_at && (
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.published_at)}</span>
          )}
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.reading_time} min read</span>
        </div>

        {post.cover_image_url && (
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-border mb-10">
            <Image src={post.cover_image_url} alt={post.title} fill sizes="(max-width: 896px) 100vw, 896px" priority className="object-cover" />
          </div>
        )}

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="glass">{tag}</Badge>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
