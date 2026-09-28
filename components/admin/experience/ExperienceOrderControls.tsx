"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { moveExperience } from "@/lib/actions/content"

interface ExperienceOrderControlsProps {
  id: string
  role: string
  index: number
  total: number
}

export function ExperienceOrderControls({ id, role, index, total }: ExperienceOrderControlsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveExperience(id, direction)
      if (!result.success) {
        toast.error(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label={`Move ${role} up`}
        title="Move up"
        disabled={isPending || index === 0}
        onClick={() => move("up")}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        aria-label={`Move ${role} down`}
        title="Move down"
        disabled={isPending || index === total - 1}
        onClick={() => move("down")}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  )
}