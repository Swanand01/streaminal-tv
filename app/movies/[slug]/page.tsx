import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MovieDetailsSkeleton } from '@/components/skeletons/movie-details-skeleton';
import { MovieContent } from './movie-content';
import { generateMovieMetadata, generateMovieJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/jsonld';
import { getMovieDetails } from '@/lib/tmdb';
import { extractIdFromSlug } from '@/lib/utils';

interface MoviePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { slug } = await params;
  const movieId = extractIdFromSlug(slug);
  if (!movieId) {
    return {
      title: 'Movie Not Found | Streaminal TV',
      description: 'The requested movie could not be found.',
    };
  }
  return generateMovieMetadata(movieId);
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params;
  const movieId = extractIdFromSlug(slug);

  if (!movieId) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-xl">Movie not found</p>
          <p className="text-muted-foreground text-sm">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  // Fetch movie for JSON-LD outside Suspense (will be deduplicated in MovieContent)
  const movie = await getMovieDetails(movieId).catch(() => null);

  return (
    <div className="bg-background min-h-screen">
      {movie && <JsonLd data={generateMovieJsonLd(movie)} />}
      <Navigation />
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieContent movieId={movieId} />
      </Suspense>
    </div>
  );
}
