"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseAdminTriggerOptions {
  onTrigger: () => void
  logoClickThreshold?: number
  logoClickWindow?: number
}

export function useAdminTrigger({
  onTrigger,
  logoClickThreshold = 5,
  logoClickWindow = 3000,
}: UseAdminTriggerOptions) {
  const clickCount = useRef(0)
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keyboard shortcut: CTRL+SHIFT+A
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault()
        onTrigger()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onTrigger])

  // Logo click counter (5 clicks within logoClickWindow ms)
  const handleLogoClick = useCallback(() => {
    clickCount.current += 1

    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }

    if (clickCount.current >= logoClickThreshold) {
      clickCount.current = 0
      onTrigger()
      return
    }

    clickTimer.current = setTimeout(() => {
      clickCount.current = 0
    }, logoClickWindow)
  }, [onTrigger, logoClickThreshold, logoClickWindow])

  return { handleLogoClick }
}
