import { ImageResponse } from "next/og"
import { siteConfig } from "@/config/site"

export const runtime = "edge"
export const alt = `${siteConfig.name} — ${siteConfig.title}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#080a0f",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 45%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.22), transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            color: "#06b6d4",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            marginTop: "24px",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            marginTop: "16px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {siteConfig.title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            marginTop: "32px",
            maxWidth: "900px",
          }}
        >
          {siteConfig.description}
        </div>
      </div>
    ),
    { ...size }
  )
}
