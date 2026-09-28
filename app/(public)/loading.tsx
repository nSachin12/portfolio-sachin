import { Skeleton } from "@/components/ui/skeleton"

export default function PublicLoading() {
  return (
    <div role="status" aria-label="Loading page" className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <span className="sr-only">Loading page content</span>
      <div className="space-y-4 py-16 text-center">
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mx-auto h-12 w-2/3 max-w-xl" />
        <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
        <Skeleton className="mx-auto h-5 w-3/4 max-w-xl" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-4 border-t border-border pt-5">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}