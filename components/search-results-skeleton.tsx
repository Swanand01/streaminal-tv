import { Skeleton } from '@/components/ui/skeleton';

export function SearchResultsSkeleton() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-9 w-80" />
                <Skeleton className="h-5 w-32" />
            </div>

            {/* People Section */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-2">
                            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                            <div className="min-w-0 flex-1 space-y-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Movies & TV Shows Section */}
            <div className="space-y-4">
                <Skeleton className="h-8 w-56" />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="aspect-2/3 w-full rounded-md" />
                            <Skeleton className="h-3.5 w-full" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
