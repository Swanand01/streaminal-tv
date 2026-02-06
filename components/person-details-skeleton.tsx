import { Skeleton } from '@/components/ui/skeleton';

export function PersonDetailsSkeleton() {
    return (
        <div className="container mx-auto px-4 py-24 md:px-8 lg:px-12">
            {/* Person Header Skeleton */}
            <div className="mb-12 flex flex-col gap-8 md:flex-row">
                {/* Profile Image */}
                <div className="shrink-0">
                    <Skeleton className="h-80 w-64 rounded-lg md:h-96 md:w-72" />
                </div>

                {/* Person Info */}
                <div className="flex-1 space-y-6">
                    {/* Name */}
                    <Skeleton className="h-12 w-3/4 md:h-14" />

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-32" />
                    </div>

                    {/* Biography */}
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-24" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Also Known As */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-6 w-24 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filmography Section Skeleton */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Grid */}
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
