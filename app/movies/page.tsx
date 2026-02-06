import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/skeletons/movies-content-skeleton';
import { Movies } from './movies';

export default function MoviesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<MoviesContentSkeleton />}>
        <Movies />
      </Suspense>
    </div>
  );
}
