"use client"

import { useState } from "react"
import Image from "next/image"

function LoadedBrandAvatar({ avatarUrl }: { avatarUrl: string | null }) {
  const [photoLoaded, setPhotoLoaded] = useState(false)

  return (
    <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-white/15">
      <Image
        src="/sachin-avatar.svg"
        alt=""
        fill
        sizes="32px"
        className="object-cover"
        priority
      />
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt=""
          fill
          sizes="32px"
          className={`object-cover transition-opacity duration-200 ${photoLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setPhotoLoaded(true)}
          onError={() => setPhotoLoaded(false)}
          priority
        />
      )}
    </span>
  )
}

export function BrandAvatar({ avatarUrl }: { avatarUrl?: string | null }) {
  return <LoadedBrandAvatar key={avatarUrl ?? "illustrated-avatar"} avatarUrl={avatarUrl ?? null} />
}