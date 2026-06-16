import { BlogForm } from "@/components/admin/editors/BlogForm"

export const metadata = { title: "New Post | Admin" }

export default function NewBlogPage() {
  return <div className="max-w-4xl"><BlogForm /></div>
}
