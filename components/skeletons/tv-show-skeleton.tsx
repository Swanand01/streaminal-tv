import { Skeleton } from '@/components/ui/skeleton';

export function TVShowSkeleton() {
  return (
    <div>
      {/* Video Player Section */}
      <div className="relative w-full pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="relative aspect-video w-full">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
        </div>
      </div>

      {/* Show Info with Sidebar Layout */}
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-8">
              {/* Title */}
              <Skeleton className="mb-2 h-10 w-3/4 md:h-12" />

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>

              {/* Genres */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Overview */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
              </div>

              {/* Episodes Grid */}
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-[180px]" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-video w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <aside className="w-full lg:block lg:w-80 xl:w-96">
            <Skeleton className="mb-4 h-7 w-40" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
