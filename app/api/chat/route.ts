import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { formatExperienceDuration, formatDateShort } from "@/lib/utils/format"

export const runtime = "edge"

interface ChatMessage {
  role: "user" | "assistant"
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

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim()
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean
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
- You are Sachin's assistant. If asked who you are, identify yourself as Sachin's assistant and ask how you can help.
- Answer only questions about Sachin and the professional information in this portfolio. For unrelated requests, explain that you are here to help visitors learn about Sachin using this portfolio's information, and briefly offer the relevant topics you can cover.
- Do not use emojis or decorative symbols.
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
    availabilityResult,
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
    supabase.from("settings").select("value").eq("key", "availability_status").maybeSingle(),
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
    profile: profileResult.data
      ? { ...profileResult.data, availability: availabilityResult.data?.value ?? profileResult.data.availability }
      : null,
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
    const body = await request.json() as { messages?: unknown }

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.some((message: unknown) =>
        !message ||
        typeof message !== "object" ||
        !("role" in message) ||
        !("content" in message) ||
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string"
      )
    ) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }
    const messages = body.messages as ChatMessage[]

    const apiKey = process.env.OPENROUTER_API_KEY
    const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-3b-instruct:free"

    if (!apiKey) {
      return NextResponse.json({ error: "AI chat not configured" }, { status: 503 })
    }

    const portfolioContext = await loadPortfolioContext()
    const systemPrompt = buildSystemPrompt(portfolioContext)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort("Chat request timed out"), 90000)
    const abortUpstream = () => controller.abort(request.signal.reason)
    request.signal.addEventListener("abort", abortUpstream, { once: true })
    if (request.signal.aborted) abortUpstream()

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
    } catch (error) {
      clearTimeout(timeoutId)
      request.signal.removeEventListener("abort", abortUpstream)
      if (controller.signal.aborted) {
        return NextResponse.json(
          { error: request.signal.aborted ? "Request cancelled" : "Chat request timed out" },
          { status: request.signal.aborted ? 499 : 504 },
        )
      }
      console.error("Chat provider request failed:", error)
      return NextResponse.json({ error: "Unable to connect to chat service" }, { status: 502 })
    }

    if (!response.ok) {
      clearTimeout(timeoutId)
      request.signal.removeEventListener("abort", abortUpstream)
      const err = await response.text()
      console.error("OpenRouter error:", err)
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 })
    }

    const reader = response.body?.getReader()
    if (!reader) {
      clearTimeout(timeoutId)
      request.signal.removeEventListener("abort", abortUpstream)
      return NextResponse.json({ error: "Empty response from chat service" }, { status: 502 })
    }

    const cleanup = () => {
      clearTimeout(timeoutId)
      request.signal.removeEventListener("abort", abortUpstream)
    }
    const stream = new ReadableStream<Uint8Array>({
      async pull(streamController) {
        try {
          const { done, value } = await reader.read()
          if (done) {
            cleanup()
            streamController.close()
          } else {
            streamController.enqueue(value)
          }
        } catch (error) {
          cleanup()
          streamController.error(error)
        }
      },
      async cancel(reason) {
        controller.abort(reason)
        cleanup()
        await reader.cancel(reason).catch(() => undefined)
      },
    })

    return new Response(stream, {
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
