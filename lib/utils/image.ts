/**
 * Compress and resize an image in the browser before upload, so stored files
 * stay small (fast to load) instead of multi-MB camera/screenshot originals.
 *
 * - Scales down so the longest edge is at most `maxDimension`.
 * - Re-encodes as WebP at `quality`.
 * - Returns the original file untouched if it isn't a raster image, can't be
 *   processed, or if compression wouldn't actually make it smaller.
 */
export async function compressImage(
  file: File,
  opts: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  const maxDimension = opts.maxDimension ?? 1600
  const quality = opts.quality ?? 0.85

  // Skip things canvas can't safely re-encode (SVG keeps vector, GIF keeps animation).
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file
  }

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("read failed"))
      reader.readAsDataURL(file)
    })

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error("decode failed"))
      image.src = dataUrl
    })

    let width = img.naturalWidth
    let height = img.naturalHeight
    if (!width || !height) return file

    if (width > maxDimension || height > maxDimension) {
      if (width >= height) {
        height = Math.round((height * maxDimension) / width)
        width = maxDimension
      } else {
        width = Math.round((width * maxDimension) / height)
        height = maxDimension
      }
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    )
    if (!blob || blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp"
    return new File([blob], newName, { type: "image/webp" })
  } catch {
    return file
  }
}
