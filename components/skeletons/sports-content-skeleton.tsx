import { Skeleton } from '@/components/ui/skeleton';

export function SportsContentSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-24 md:px-8 lg:px-12">
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-3">
            <Skeleton className="h-5 w-16" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="min-w-0 flex-1 pb-12">
          <div className="mb-6 flex justify-between">
            <div>
              <Skeleton className="mb-2 h-9 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function MatchCardSkeleton() {
  return (
    <div className="border-border rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-10" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-6" />
        <div className="flex flex-1 flex-col items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
