import { notFound } from "next/navigation"
import { getTestimonialById } from "@/lib/actions/content"
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm"

export const metadata = { title: "Edit Testimonial | Admin" }

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)
  if (!testimonial) notFound()
  return <div className="max-w-3xl"><TestimonialForm testimonial={testimonial} /></div>
}
