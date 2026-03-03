import { Skeleton } from '@/components/ui/skeleton';

export function MediaCarouselSkeleton() {
  return (
    <section className="group/carousel relative mb-8">
      <div className="container mx-auto">
        <Skeleton className="mb-4 ml-4 h-7 w-48 md:ml-8 lg:ml-12" />

        <div className="flex gap-3 overflow-hidden px-4 py-2 md:gap-4 md:px-8 lg:px-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[160px] shrink-0 md:w-[200px]">
              <Skeleton className="aspect-2/3 w-full rounded-md" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
