import { notFound } from "next/navigation"
import { getBlogById } from "@/lib/actions/blog"
import { BlogForm } from "@/components/admin/editors/BlogForm"

export const metadata = { title: "Edit Post | Admin" }

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = await getBlogById(id)
  if (!blog) notFound()
  return <div className="max-w-4xl"><BlogForm blog={blog} /></div>
}
