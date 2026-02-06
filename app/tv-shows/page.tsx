import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/skeletons/movies-content-skeleton';
import { TVShows } from './tv-shows';

export default function TVShowsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<MoviesContentSkeleton />}>
        <TVShows />
      </Suspense>
    </div>
  );
}
