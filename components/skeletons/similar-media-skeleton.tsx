import { Skeleton } from '@/components/ui/skeleton';

export function SimilarMediaSkeleton() {
  return (
    <aside className="w-full lg:block lg:w-80 xl:w-96">
      <Skeleton className="mb-4 h-7 w-40" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-2/3 w-full rounded-md" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </aside>
  );
}
