"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Upload,
  Loader2,
  Trash2,
  FileText,
  CheckCircle2,
  Circle,
  Download,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"
import {
  uploadResume,
  createResumeFromUrl,
  setActiveResume,
  deleteResume,
} from "@/lib/actions/resume"
import type { Resume } from "@/lib/types"

type Mode = "upload" | "url"

export function ResumeManager({ resumes }: { resumes: Resume[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [mode, setMode] = useState<Mode>("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // shared form state
  const [version, setVersion] = useState("")
  const [makeActive, setMakeActive] = useState(resumes.length === 0)
  const [fileName, setFileName] = useState("")
  // url mode
  const [fileUrl, setFileUrl] = useState("")
  const [urlFileName, setUrlFileName] = useState("")

  function refresh() {
    router.refresh()
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast.error("Please choose a PDF file.")
      return
    }
    const formData = new FormData()
    formData.set("file", file)
    formData.set("version", version)
    formData.set("is_active", String(makeActive))

    startTransition(async () => {
      const result = await uploadResume(formData)
      if (result.success) {
        toast.success("Resume uploaded")
        setVersion("")
        setFileName("")
        if (fileInputRef.current) fileInputRef.current.value = ""
        refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fileUrl.trim()) {
      toast.error("Please paste a PDF URL.")
      return
    }
    startTransition(async () => {
      const result = await createResumeFromUrl({
        file_url: fileUrl.trim(),
        file_name: urlFileName.trim() || "resume.pdf",
        version: version.trim() || null,
        is_active: makeActive,
      })
      if (result.success) {
        toast.success("Resume added")
        setFileUrl("")
        setUrlFileName("")
        setVersion("")
        refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleSetActive(id: string) {
    startTransition(async () => {
      const result = await setActiveResume(id)
      if (result.success) {
        toast.success("Active resume updated")
        refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this resume? This cannot be undone.")) return
    startTransition(async () => {
      const result = await deleteResume(id)
      if (result.success) {
        toast.success("Resume deleted")
        refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="space-y-8">
      {/* Add new */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Add Resume</h2>
          <div className="flex rounded-lg border border-border p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors", mode === "upload" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Upload className="h-3.5 w-3.5" />Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors", mode === "url" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <LinkIcon className="h-3.5 w-3.5" />External URL
            </button>
          </div>
        </div>

        {mode === "upload" ? (
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="file">PDF File *</Label>
              <label
                htmlFor="file"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border bg-background/50 px-4 py-6 hover:border-primary/40 transition-colors"
              >
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {fileName || "Click to choose a PDF (max 10MB)"}
                </span>
              </label>
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="version">Version label (optional)</Label>
              <Input id="version" placeholder="e.g. 2026, Senior AI Engineer" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label>Set as active</Label>
                <p className="text-xs text-muted-foreground">Show this one on the public resume page</p>
              </div>
              <Switch checked={makeActive} onCheckedChange={setMakeActive} />
            </div>

            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload Resume
            </Button>
          </form>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="file_url">PDF URL *</Label>
              <Input id="file_url" placeholder="https://…/resume.pdf" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url_file_name">Display file name</Label>
              <Input id="url_file_name" placeholder="resume.pdf" value={urlFileName} onChange={(e) => setUrlFileName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="version_url">Version label (optional)</Label>
              <Input id="version_url" placeholder="e.g. 2026" value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label>Set as active</Label>
                <p className="text-xs text-muted-foreground">Show this one on the public resume page</p>
              </div>
              <Switch checked={makeActive} onCheckedChange={setMakeActive} />
            </div>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
              Add Resume
            </Button>
          </form>
        )}
      </div>

      {/* Existing */}
      <div className="space-y-3">
        <h2 className="font-semibold text-foreground">Uploaded Resumes ({resumes.length})</h2>
        {resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No resumes yet. Upload one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors",
                  r.is_active ? "border-primary/40" : "border-border"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground text-sm truncate">{r.file_name}</p>
                    {r.version && <Badge variant="glass" className="text-xs">v{r.version}</Badge>}
                    {r.is_active && <Badge variant="green" className="text-xs">Active</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{r.download_count} downloads</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="View">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  {!r.is_active && (
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs" disabled={isPending} onClick={() => handleSetActive(r.id)} title="Set active">
                      <Circle className="h-3.5 w-3.5" />Set active
                    </Button>
                  )}
                  {r.is_active && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 px-2">
                      <CheckCircle2 className="h-3.5 w-3.5" />Live
                    </span>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={isPending} onClick={() => handleDelete(r.id)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
