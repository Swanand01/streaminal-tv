import { Skeleton } from '@/components/ui/skeleton';

export function HeroBannerSkeleton() {
    return (
        <section className="relative h-[70vh] min-h-[600px] w-full md:h-[80vh]">
            <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

            {/* Gradient overlay to fade to background at bottom - matches real hero */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/0" />

            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 md:px-8 lg:px-12">
                    <div className="max-w-2xl space-y-4 md:space-y-6">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-5 w-20" />
                        </div>

                        <Skeleton className="h-12 w-full md:h-16 lg:h-20" />
                        <Skeleton className="h-12 w-3/4 md:h-16 lg:h-20" />

                        <div className="space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-11 w-32" />
                            <Skeleton className="h-11 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
