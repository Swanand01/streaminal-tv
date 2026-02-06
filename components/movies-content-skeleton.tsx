import { Skeleton } from '@/components/ui/skeleton';

export function MoviesContentSkeleton() {
    return (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-24">
            <div className="flex gap-8">
                {/* Desktop Sidebar Skeleton */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24 space-y-6">
                        {/* Genres Section */}
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-16" />
                            <div className="space-y-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2">
                                        <Skeleton className="h-4 w-4 rounded" />
                                        <Skeleton className="h-4 flex-1" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Separator */}
                        <Skeleton className="h-px w-full" />

                        {/* Minimum Rating Section */}
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-32" />
                            <div className="space-y-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Skeleton */}
                <main className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <Skeleton className="h-9 w-32 mb-2" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-35" />
                            <Skeleton className="h-10 w-24 lg:hidden" />
                        </div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-2/3 w-full rounded-md" />
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
