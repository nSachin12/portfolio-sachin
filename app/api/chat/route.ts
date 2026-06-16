import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { formatExperienceDuration, formatDateShort } from "@/lib/utils/format"

export const runtime = "edge"

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

type PortfolioContext = {
  profile: {
    full_name: string | null
    title: string | null
    tagline: string | null
    bio: string | null
    location: string | null
    email: string | null
    phone: string | null
    availability: string | null
    years_of_exp: number | null
    months_of_exp: number | null
    github_url: string | null
    linkedin_url: string | null
    twitter_url: string | null
    website_url: string | null
  } | null
  skills: Array<{ name: string; category: string; proficiency: number }>
  experiences: Array<{
    role: string
    company: string
    description: string | null
    start_date: string
    end_date: string | null
    is_current: boolean
  }>
  projects: Array<{ title: string; description: string; category: string | null }>
  certifications: Array<{ title: string; issuer: string }>
  achievements: Array<{ title: string; description: string | null; category: string; organization: string | null; date: string | null }>
  testimonials: Array<{ name: string; role: string | null; company: string | null; content: string; rating: number }>
  blogs: Array<{ title: string; excerpt: string | null; category: string | null; reading_time: number }>
  resume: { file_url: string; file_name: string; version: string | null } | null
}

function getLatestUserMessage(messages: ChatMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? ""
}

// ---- Typo-tolerant intent matching --------------------------------------
// Visitors make typos, and the small LLM hangs/loops on ambiguous input.
// So we resolve the intended topic ourselves with edit-distance matching and
// answer from the SPECIFIC page's data — never bleeding across pages.

function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  let prev = Array.from({ length: n + 1 }, (_, i) => i)
  let curr = new Array<number>(n + 1).fill(0)

  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    const tmp = prev
    prev = curr
    curr = tmp
  }
  return prev[n]
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean)
}

// A token matches a keyword if it's equal, a near-complete stem of it
// (e.g. "project" ↔ "projects"), or a close typo. Stem and typo checks
// require length proximity so short words like "what" can't collide with
// longer keywords like "whatsapp".
function tokenMatches(token: string, keyword: string): boolean {
  if (token === keyword) return true

  // Stem / plural: one is contained in the other AND they're nearly the same
  // length (so "whatsapp".includes("what") is rejected — diff of 4).
  if (
    token.length >= 4 &&
    keyword.length >= 4 &&
    Math.abs(token.length - keyword.length) <= 2 &&
    (token.includes(keyword) || keyword.includes(token))
  ) {
    return true
  }

  // Typo tolerance: only for longer tokens to avoid stopword collisions.
  if (token.length >= 5 && Math.abs(token.length - keyword.length) <= 2) {
    const threshold = token.length >= 8 ? 2 : 1
    return editDistance(token, keyword) <= threshold
  }

  return false
}

// Intent definitions, ordered by tie-break priority (earlier wins ties).
// More specific topics (links, content pages) come before generic contact
// and the catch-all "about", so e.g. "about his projects" → projects.
const INTENTS: Array<{ key: string; keywords: string[] }> = [
  { key: "resume", keywords: ["resume", "resumes", "cv", "curriculum"] },
  { key: "github", keywords: ["github"] },
  { key: "linkedin", keywords: ["linkedin"] },
  { key: "twitter", keywords: ["twitter", "tweet"] },
  { key: "website", keywords: ["website", "webpage"] },
  { key: "email", keywords: ["email", "mail", "gmail"] },
  { key: "phone", keywords: ["phone", "mobile", "whatsapp", "telephone", "call"] },
  { key: "skills", keywords: ["skill", "skills", "skillset", "tech", "technology", "technologies", "stack", "expertise", "tools", "toolset"] },
  { key: "experience", keywords: ["experience", "experiences", "job", "jobs", "career", "employment", "work", "worked", "working", "company", "companies", "role", "roles", "position", "positions"] },
  { key: "projects", keywords: ["project", "projects", "portfolio", "apps", "built", "casestudy"] },
  { key: "certifications", keywords: ["certification", "certifications", "certificate", "certificates", "certified", "credential", "credentials", "course", "courses"] },
  { key: "achievements", keywords: ["achievement", "achievements", "award", "awards", "recognition", "accomplishment", "accomplishments", "honor", "honour"] },
  { key: "testimonials", keywords: ["testimonial", "testimonials", "review", "reviews", "feedback", "recommendation", "recommendations", "recommend", "reference", "references", "client", "clients"] },
  { key: "blog", keywords: ["blog", "blogs", "article", "articles", "post", "posts", "writing", "writes", "wrote"] },
  { key: "availability", keywords: ["available", "availability", "hire", "hiring", "freelance", "freelancing", "opportunity", "opportunities"] },
  { key: "contact", keywords: ["contact", "reach", "connect", "message", "social", "socials", "detail", "details", "info", "information"] },
  { key: "about", keywords: ["about", "bio", "biography", "background", "summary", "introduce", "introduction", "yourself", "who"] },
]

// Score every intent and return the best-matching one (highest keyword count),
// or null when nothing matches (then the LLM handles the open-ended question).
function classifyIntent(text: string): string | null {
  const tokens = tokenize(text)
  let best: string | null = null
  let bestScore = 0

  for (const { key, keywords } of INTENTS) {
    let score = 0
    for (const kw of keywords) {
      if (tokens.some((tok) => tokenMatches(tok, kw))) score++
    }
    if (score > bestScore) {
      bestScore = score
      best = key
    }
  }

  return bestScore > 0 ? best : null
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
}

// Pick a random variant so answers feel fresh and conversational instead of
// returning the exact same string every time for a given intent.
function pick<T>(variants: T[]): T {
  return variants[Math.floor(Math.random() * variants.length)]
}

// Friendly, varied "not available" message: states it's unavailable, then
// invites the visitor to reach out to Sachin for clarity, then the link.
function notAvailableMessage(subject: string, contactPage: string): string {
  return pick([
    `Currently, there's no information on ${subject} here. If you'd like more clarity, feel free to reach out to Sachin: ${contactPage}`,
    `Right now, I don't have any details on ${subject} to share. For more clarity, you can connect with Sachin directly: ${contactPage}`,
    `It looks like there's nothing on ${subject} yet. Reach out to Sachin and he'll be glad to help: ${contactPage}`,
    `Hmm, I couldn't find anything on ${subject} here. If you want clarity, feel free to contact Sachin: ${contactPage}`,
  ])
}

// Determine the user's intent first, then fetch ONLY that topic's data.
// Returns a ready-to-send answer, or null when the message is open-ended
// (then we let the model handle it).
function routeAnswer(text: string, ctx: PortfolioContext, siteUrl: string): string | null {
  const intent = classifyIntent(text)
  if (!intent) return null

  const profile = ctx.profile
  const contactPage = new URL("/contact", siteUrl).toString()
  const notAvailable = (subject: string) => notAvailableMessage(subject, contactPage)

  switch (intent) {
    case "resume": {
      const resumePageUrl = new URL("/resume", siteUrl).toString()
      if (!ctx.resume?.file_url) return notAvailable("his resume")
      return pick([
        `Sure! You can view Sachin's resume right here on the site — head to the Resume page (${resumePageUrl}) and tap "View PDF" or "Download PDF". 📄`,
        `Absolutely — Sachin's resume is on the Resume page (${resumePageUrl}). Just hit "View PDF" or "Download PDF" to open it. 📄`,
        `You can find Sachin's resume on the Resume page: ${resumePageUrl}. Use the "View PDF" or "Download PDF" button there. 📄`,
      ])
    }

    case "github":
      return profile?.github_url
        ? pick([
            `Here's Sachin's GitHub: ${profile.github_url} 🐙`,
            `You can find Sachin on GitHub here: ${profile.github_url} 🐙`,
            `Sachin's GitHub profile: ${profile.github_url} 🐙`,
          ])
        : notAvailable("his GitHub link")

    case "linkedin":
      return profile?.linkedin_url
        ? pick([
            `Here's Sachin's LinkedIn: ${profile.linkedin_url} 💼`,
            `You can connect with Sachin on LinkedIn here: ${profile.linkedin_url} 💼`,
            `Sachin's LinkedIn profile: ${profile.linkedin_url} 💼`,
          ])
        : notAvailable("his LinkedIn profile")

    case "twitter":
      return profile?.twitter_url
        ? pick([
            `Here's Sachin's Twitter/X: ${profile.twitter_url}`,
            `You can follow Sachin on Twitter/X here: ${profile.twitter_url}`,
          ])
        : notAvailable("his Twitter/X profile")

    case "website":
      return profile?.website_url
        ? pick([
            `Here's Sachin's website: ${profile.website_url}`,
            `You can check out Sachin's website here: ${profile.website_url}`,
          ])
        : notAvailable("his personal website")

    case "email":
      return profile?.email
        ? pick([
            `You can email Sachin at: ${profile.email} 📧`,
            `Sachin's email is: ${profile.email} 📧`,
            `Feel free to reach Sachin by email at: ${profile.email} 📧`,
          ])
        : notAvailable("his email address")

    case "phone":
      return profile?.phone
        ? pick([
            `You can reach Sachin by phone at: ${profile.phone} 📞`,
            `Sachin's phone number is: ${profile.phone} 📞`,
            `Feel free to call Sachin at: ${profile.phone} 📞`,
          ])
        : notAvailable("his phone number")

    case "contact": {
      const lines: string[] = []
      if (profile?.email) lines.push(`📧 Email: ${profile.email}`)
      if (profile?.phone) lines.push(`📞 Phone: ${profile.phone}`)
      if (profile?.linkedin_url) lines.push(`💼 LinkedIn: ${profile.linkedin_url}`)
      if (profile?.github_url) lines.push(`🐙 GitHub: ${profile.github_url}`)
      if (profile?.twitter_url) lines.push(`🐦 Twitter/X: ${profile.twitter_url}`)

      if (lines.length === 0) {
        return notAvailable("Sachin's direct contact details")
      }
      lines.push(`You can also use the contact form here: ${contactPage}`)
      const intro = pick([
        "Here's how you can reach Sachin:",
        "Sure! Here are the best ways to reach Sachin:",
        "You can connect with Sachin through any of these:",
        "Here are Sachin's contact details:",
      ])
      return `${intro}\n${lines.join("\n")}`
    }

    // Everything else (skills, projects, experience, "top skill", comparisons,
    // open-ended chat, etc.) is handled conversationally by the model, which
    // can reason over the structured DATA in the system prompt.
    default:
      return null
  }
}

function formatExpRange(start: string, end: string | null, isCurrent: boolean) {
  const startLabel = formatDateShort(start)
  const endLabel = isCurrent ? "Present" : end ? formatDateShort(end) : "Present"
  return `${startLabel} – ${endLabel}`
}

// Render the portfolio context as clean, readable text. Small models follow
// plain labelled text far more reliably than raw JSON, which reduces rambling.
function buildContextBlock(context: PortfolioContext) {
  const { profile } = context
  const sections: string[] = []

  if (profile) {
    const bio = profile.bio ? truncate(profile.bio, 600) : null
    const exp = [
      profile.years_of_exp ? `${profile.years_of_exp} year(s)` : null,
      profile.months_of_exp ? `${profile.months_of_exp} month(s)` : null,
    ].filter(Boolean).join(" ")
    const facts = [
      profile.full_name && `Name: ${profile.full_name}`,
      profile.title && `Title: ${profile.title}`,
      profile.tagline && `Tagline: ${profile.tagline}`,
      profile.location && `Location: ${profile.location}`,
      profile.availability && `Availability: ${profile.availability}`,
      exp && `Total experience: ${exp}`,
      bio && `Bio: ${bio}`,
    ].filter(Boolean)
    if (facts.length) sections.push(`PROFILE\n${facts.join("\n")}`)
  }

  // Sorted by proficiency so the model can answer "top skill", "is he strong
  // in X", etc. Category is kept inline for grouping questions.
  const skillLines = [...context.skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 20)
    .map((s) => `- ${s.name} (${s.category}) — ${s.proficiency}% proficiency`)
  if (skillLines.length) sections.push(`SKILLS (highest proficiency first)\n${skillLines.join("\n")}`)

  const expLines = context.experiences.slice(0, 5).map((exp) => {
    const period = formatExpRange(exp.start_date, exp.end_date, exp.is_current)
    const duration = formatExperienceDuration(exp.start_date, exp.end_date, exp.is_current)
    const desc = exp.description ? ` — ${exp.description.replace(/\s+/g, " ").trim()}` : ""
    return `- ${exp.role} at ${exp.company} (${period}, ${duration})${desc}`
  })
  if (expLines.length) sections.push(`EXPERIENCE\n${expLines.join("\n")}`)

  const projectLines = context.projects.slice(0, 6).map((p) => {
    const category = p.category ? ` [${p.category}]` : ""
    const desc = p.description ? `: ${p.description.replace(/\s+/g, " ").trim()}` : ""
    return `- ${p.title}${category}${desc}`
  })
  if (projectLines.length) sections.push(`PROJECTS\n${projectLines.join("\n")}`)

  const certLines = context.certifications.slice(0, 6).map((c) => `- ${c.title} (${c.issuer})`)
  if (certLines.length) sections.push(`CERTIFICATIONS\n${certLines.join("\n")}`)

  const achievementLines = context.achievements.slice(0, 6).map((a) => {
    const org = a.organization ? ` — ${a.organization}` : ""
    const desc = a.description ? `: ${a.description.replace(/\s+/g, " ").trim()}` : ""
    return `- ${a.title} [${a.category}]${org}${desc}`
  })
  if (achievementLines.length) sections.push(`ACHIEVEMENTS\n${achievementLines.join("\n")}`)

  const testimonialLines = context.testimonials.slice(0, 4).map((t) => {
    const who = [t.role, t.company].filter(Boolean).join(", ")
    const attribution = who ? `${t.name} (${who})` : t.name
    return `- ${attribution}, ${t.rating}/5: "${t.content.replace(/\s+/g, " ").trim()}"`
  })
  if (testimonialLines.length) sections.push(`TESTIMONIALS\n${testimonialLines.join("\n")}`)

  const blogLines = context.blogs.slice(0, 6).map((b) => {
    const category = b.category ? ` [${b.category}]` : ""
    const excerpt = b.excerpt ? `: ${b.excerpt.replace(/\s+/g, " ").trim()}` : ""
    return `- ${b.title}${category} (${b.reading_time} min read)${excerpt}`
  })
  if (blogLines.length) sections.push(`BLOG POSTS\n${blogLines.join("\n")}`)

  return sections.length ? sections.join("\n\n") : "No portfolio data is available."
}

function buildSystemPrompt(context: PortfolioContext) {
  const contextBlock = buildContextBlock(context)

  return `You are Sachin's friendly AI assistant on his portfolio website. You chat with visitors (recruiters, clients, founders) like a warm, humble human assistant and help them learn about Sachin.

HOW TO TALK:
- Sound human and conversational — never robotic, never a data dump. Vary your wording naturally.
- ANSWER EXACTLY WHAT IS ASKED. If they ask for his "top skill", name the single highest-proficiency skill — don't list them all. If they ask "is he good at Python?", give a direct take from the data. Tailor the answer to the precise question.
- You MAY reason over the DATA: rank by proficiency, compare, count, pick the most relevant item, summarize. Just don't invent facts that aren't there.
- Lead with the direct answer in a sentence or two. Use a short bullet list only when the question really calls for a list. Offer a light follow-up when natural ("Want to know about his projects too?").

STRICT FACTS:
1. Use ONLY the facts in the DATA section. Never invent or guess details, links, dates, numbers, or opinions not supported by the data.
2. If something isn't in the DATA, say so warmly and suggest the contact page — e.g. "I don't have that detail here, but you can reach out via the contact page and Sachin will be happy to help." Never make anything up.
3. Keep it tight: under 120 words. Write each fact once — never repeat words, phrases, or sentences. Stop as soon as you've answered.
4. Refer to him as "Sachin", and keep a humble, helpful tone.

DATA:
${contextBlock}`
}

function streamTextAnswer(text: string) {
  const encoder = new TextEncoder()
  const payload = `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n` + `data: [DONE]\n\n`

  return new Response(encoder.encode(payload), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

async function loadPortfolioContext(): Promise<PortfolioContext> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      profile: null,
      skills: [],
      experiences: [],
      projects: [],
      certifications: [],
      achievements: [],
      testimonials: [],
      blogs: [],
      resume: null,
    }
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

  const [
    profileResult,
    skillsResult,
    experiencesResult,
    projectsResult,
    certificationsResult,
    achievementsResult,
    testimonialsResult,
    blogsResult,
    resumeResult,
  ] = await Promise.all([
    supabase.from("profiles").select("full_name,title,tagline,bio,location,email,phone,availability,years_of_exp,months_of_exp,github_url,linkedin_url,twitter_url,website_url").limit(1).maybeSingle(),
    supabase.from("skills").select("name,category,proficiency").order("category").order("proficiency", { ascending: false }),
    supabase.from("experience").select("role,company,description,start_date,end_date,is_current").order("order_index"),
    supabase.from("projects").select("title,description,category").eq("published", true).order("featured", { ascending: false }).order("order_index"),
    supabase.from("certifications").select("title,issuer").order("order_index"),
    supabase.from("achievements").select("title,description,category,organization,date").order("order_index"),
    supabase.from("testimonials").select("name,role,company,content,rating").eq("published", true).order("featured", { ascending: false }).order("order_index"),
    supabase.from("blogs").select("title,excerpt,category,reading_time").eq("published", true).order("published_at", { ascending: false }),
    supabase.from("resume").select("file_url,file_name,version").eq("is_active", true).limit(1).maybeSingle(),
  ])

  return {
    profile: profileResult.data ?? null,
    skills: skillsResult.data ?? [],
    experiences: experiencesResult.data ?? [],
    projects: projectsResult.data ?? [],
    certifications: certificationsResult.data ?? [],
    achievements: achievementsResult.data ?? [],
    testimonials: testimonialsResult.data ?? [],
    blogs: blogsResult.data ?? [],
    resume: resumeResult.data ?? null,
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free"

    if (!apiKey) {
      return NextResponse.json({ error: "AI chat not configured" }, { status: 503 })
    }

    const portfolioContext = await loadPortfolioContext()
    const latestUserMessage = getLatestUserMessage(messages)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Resolve the topic ourselves (typo-tolerant, page-scoped) before ever
    // touching the LLM. This keeps factual answers reliable and means typos
    // never cause the model to hang or loop.
    const directAnswer = routeAnswer(latestUserMessage, portfolioContext, siteUrl)
    if (directAnswer) {
      return streamTextAnswer(directAnswer)
    }

    const systemPrompt = buildSystemPrompt(portfolioContext)

    // Hard timeout so a slow/looping free-tier model can never hang the chat.
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    let response: Response
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "Sachin Portfolio AI",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.slice(-10),
          ],
          max_tokens: 250,
          temperature: 0.3,
          frequency_penalty: 0.5,
          repetition_penalty: 1.2,
          stream: true,
        }),
      })
    } catch {
      clearTimeout(timeoutId)
      return streamTextAnswer(
        `Sorry, that's taking longer than expected on my end. Please try asking again, or reach out via the contact page: ${new URL("/contact", siteUrl).toString()}`,
      )
    }
    clearTimeout(timeoutId)

    if (!response.ok) {
      const err = await response.text()
      console.error("OpenRouter error:", err)
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 })
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
