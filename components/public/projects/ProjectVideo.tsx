"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { parseVideoUrl } from "@/lib/utils/video"

interface ProjectVideoProps {
  url: string
  /** Cover image to use as the poster before playback starts. */
  poster?: string | null
  title: string
}

/**
 * A poster + big play button that swaps to the actual video (YouTube/Vimeo
 * embed or a direct file) on click. Renders nothing for unrecognised URLs so
 * the detail page can fall back to the plain cover image.
 */
export function ProjectVideo({ url, poster, title }: ProjectVideoProps) {
  const [playing, setPlaying] = useState(false)
  const video = parseVideoUrl(url)
  if (!video) return null

  const thumb = poster || video.thumbnail

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title} video`}
          className="group absolute inset-0 h-full w-full"
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/20 via-purple/20 to-cyan/20" />
          )}
          <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/45" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 sm:h-20 sm:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary/90 shadow-lg shadow-primary/40 ring-1 ring-white/20 transition-transform group-hover:scale-110">
            <Play className="h-7 w-7 sm:h-8 sm:w-8 translate-x-0.5 fill-white text-white" />
          </span>
        </button>
      ) : video.kind === "file" ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={video.src} controls autoPlay className="h-full w-full bg-black object-contain" />
      ) : (
        <iframe
          src={video.embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full"
        />
      )}
    </div>
  )
}
