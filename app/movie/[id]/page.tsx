import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MovieDetailsSkeleton } from '@/components/skeletons/movie-details-skeleton';
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
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-xl">Invalid movie ID</p>
          <p className="text-muted-foreground text-sm">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieContent movieId={movieId} />
      </Suspense>
    </div>
  );
}
