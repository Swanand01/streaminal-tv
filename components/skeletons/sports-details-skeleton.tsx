import { Skeleton } from '@/components/ui/skeleton';

export function SportsDetailsSkeleton() {
  return (
    <>
      <div className="relative w-full pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <Skeleton className="aspect-video w-full rounded-lg" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-4 w-14" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <Skeleton className="mb-2 h-10 w-64" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>
          <Skeleton className="h-4 w-6" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </>
  );
}
