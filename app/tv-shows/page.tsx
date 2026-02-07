import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/skeletons/movies-content-skeleton';
import { TVShows } from './tv-shows';

export const metadata: Metadata = {
  title: 'Watch TV Shows Online Free - Browse HD Series | Streaminal TV',
  description: 'Watch popular TV shows and series online free in HD. Browse by genre and rating. Stream all episodes without subscription on Streaminal TV.',
  openGraph: {
    title: 'Watch TV Shows Online Free - Browse HD Series | Streaminal TV',
    description: 'Watch popular TV shows and series online free in HD. Browse by genre and rating without subscription.',
    type: 'website',
    siteName: 'Streaminal TV',
  },
  twitter: {
    card: 'summary',
    title: 'Watch TV Shows Online Free - Browse HD Series | Streaminal TV',
    description: 'Watch popular TV shows and series online free in HD.',
  },
};

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
