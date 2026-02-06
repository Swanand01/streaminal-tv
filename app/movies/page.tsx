import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/movies-content-skeleton';
import { Movies } from './movies';

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Suspense fallback={<MoviesContentSkeleton />}>
        <Movies />
      </Suspense>
    </div>
  );
}
