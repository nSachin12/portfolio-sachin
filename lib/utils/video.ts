/**
 * Parse a public video URL (YouTube, Vimeo, or a direct file) into the pieces
 * the player needs: an embed/source URL and, where available, a thumbnail.
 * Returns `null` for empty or unrecognised URLs so callers can fall back to
 * the cover image.
 */
export type ParsedVideo =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; id: string; embedUrl: string; thumbnail: null }
  | { kind: "file"; src: string; thumbnail: null }

export function parseVideoUrl(url: string | null | undefined): ParsedVideo | null {
  if (!url) return null
  const u = url.trim()
  if (!u) return null

  // YouTube — watch, youtu.be, embed, shorts
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  )
  if (yt) {
    const id = yt[1]
    return {
      kind: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    }
  }

  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) {
    const id = vm[1]
    return {
      kind: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      thumbnail: null,
    }
  }

  // Direct video file
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(u)) {
    return { kind: "file", src: u, thumbnail: null }
  }

  return null
}
