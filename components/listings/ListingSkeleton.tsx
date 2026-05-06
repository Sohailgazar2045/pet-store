import { Skeleton } from "@/components/ui/skeleton"

export function ListingSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <div className="pt-4 border-t border-white/10 flex justify-between">
           <div className="flex gap-2">
             <Skeleton className="h-6 w-6 rounded-full" />
             <Skeleton className="h-4 w-20 rounded-lg" />
           </div>
           <Skeleton className="h-4 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ListingSkeleton key={i} />
      ))}
    </div>
  )
}
