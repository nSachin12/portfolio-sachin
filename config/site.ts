export const siteConfig = {
  name: "Nadimidoddi Sachin",
  title: "AI Automation Engineer",
  description:
    "AI Automation Engineer specializing in intelligent systems, workflow automation, and scalable AI solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  keywords: [
    "AI Automation Engineer",
    "Artificial Intelligence",
    "Automation",
    "Machine Learning",
    "Python",
    "Next.js",
    "Full Stack",
    "Nadimidoddi Sachin",
  ],
  author: {
    name: "Nadimidoddi Sachin",
    email: process.env.NEXT_PUBLIC_EMAIL ?? "",
  },
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://linkedin.com",
  },
} as const

export type SiteConfig = typeof siteConfig
