import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/movies-content-skeleton';
import { TVShows } from './tv-shows';

export default function TVShowsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <Suspense fallback={<MoviesContentSkeleton />}>
                <TVShows />
            </Suspense>
        </div>
    );
}
