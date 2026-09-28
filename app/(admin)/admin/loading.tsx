import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div role="status" aria-label="Loading admin page" className="space-y-6">
      <span className="sr-only">Loading admin page content</span>
      <Skeleton className="h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-4 border-b border-border py-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}