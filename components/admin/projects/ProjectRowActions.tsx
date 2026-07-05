"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { MoreVertical, Pencil, Pin, PinOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { setProjectOrder } from "@/lib/actions/projects"

interface ProjectRowActionsProps {
  id: string
  title: string
  order: number | null
}

export function ProjectRowActions({ id, title, order }: ProjectRowActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [pinOpen, setPinOpen] = useState(false)
  const [value, setValue] = useState(order != null ? String(order) : "1")
  const isPinned = order != null

  function savePin() {
    const n = parseInt(value, 10)
    if (Number.isNaN(n) || n < 0) {
      toast.error("Enter a whole number (0 or higher).")
      return
    }
    startTransition(async () => {
      const res = await setProjectOrder(id, n)
      if (res.success) {
        toast.success(`Pinned at position ${n}`)
        setPinOpen(false)
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  function unpin() {
    startTransition(async () => {
      const res = await setProjectOrder(id, null)
      if (res.success) {
        toast.success("Project unpinned")
        router.refresh()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Project actions">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <Link href={`/admin/projects/${id}`} className="cursor-pointer">
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault()
              setValue(order != null ? String(order) : "1")
              setPinOpen(true)
            }}
          >
            <Pin className="h-4 w-4" />
            {isPinned ? "Change pin" : "Pin"}
          </DropdownMenuItem>
          {isPinned && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault()
                  unpin()
                }}
              >
                <PinOff className="h-4 w-4" />
                Unpin
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={pinOpen} onOpenChange={setPinOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Pin “{title}”</DialogTitle>
            <DialogDescription>
              Lower numbers appear first on the public Projects page. Unpinned projects show after all pinned ones.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor={`pin-${id}`}>Position number</Label>
            <Input
              id={`pin-${id}`}
              type="number"
              min={0}
              step={1}
              value={value}
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  savePin()
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={savePin} disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save pin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
