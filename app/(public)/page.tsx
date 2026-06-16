import { HeroSection } from "@/components/public/home/HeroSection"
import { CommandCenter } from "@/components/public/home/CommandCenter"
import { FeaturedProjects } from "@/components/public/home/FeaturedProjects"
import { SkillsPreview } from "@/components/public/home/SkillsPreview"
import { TestimonialsPreview } from "@/components/public/home/TestimonialsPreview"
import { CTASection } from "@/components/public/home/CTASection"
import { getFeaturedProjects, getProjects } from "@/lib/actions/projects"
import { getProfile } from "@/lib/actions/profile"
import { getSkills, getTestimonials } from "@/lib/actions/content"

export const revalidate = 3600

export default async function HomePage() {
  const [profile, featuredProjects, projectsPage, skills, testimonials] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getProjects({ page: 1, limit: 1 }),
    getSkills(),
    getTestimonials(true),
  ])

  return (
    <div className="grid-bg">
      <HeroSection profile={profile} projectCount={projectsPage.total} skillCount={skills.length} />
      <CommandCenter />
      <FeaturedProjects projects={featuredProjects} />
      <SkillsPreview skills={skills} />
      <TestimonialsPreview testimonials={testimonials} />
      <CTASection />
    </div>
  )
}
