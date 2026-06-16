import Link from "next/link"
import { createServiceClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

export const metadata = { title: "Blog | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const supabase = await createServiceClient()
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts?.length ?? 0} posts</p>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/blog/new"><Plus className="h-4 w-4" />New Post</Link>
        </Button>
      </div>

      {!posts?.length ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No blog posts yet.</p>
          <Button asChild size="sm"><Link href="/admin/blog/new"><Plus className="h-4 w-4 mr-2" />Write first post</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground text-sm truncate">{post.title}</p>
                  {post.published ? <Badge variant="green" className="text-xs">Published</Badge> : <Badge variant="glass" className="text-xs">Draft</Badge>}
                  {post.category && <Badge variant="glass" className="text-xs">{post.category}</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.reading_time}min read</span>
                  <span>{formatDate(post.created_at)}</span>
                  <span>{post.views} views</span>
                </div>
              </div>
              <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <Link href={`/admin/blog/${post.id}`}><Pencil className="h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
