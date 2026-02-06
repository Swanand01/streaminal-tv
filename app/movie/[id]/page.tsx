import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MovieDetailsSkeleton } from '@/components/movie-details-skeleton';
import { MovieContent } from './movie-content';

interface MoviePageProps {
    params: Promise<{ id: string }>;
}

export default async function MoviePage({ params }: MoviePageProps) {
    const { id } = await params;
    const movieId = parseInt(id);

    // Check for invalid ID
    if (isNaN(movieId)) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Invalid movie ID</p>
                    <p className="text-sm text-muted-foreground">Please check the URL and try again</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <Suspense fallback={<MovieDetailsSkeleton />}>
                <MovieContent movieId={movieId} />
            </Suspense>
        </div>
    );
}
