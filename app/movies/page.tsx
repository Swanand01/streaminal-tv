import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/skeletons/movies-content-skeleton';
import { Movies } from './movies';

export const metadata: Metadata = {
  title: 'Watch Movies Online Free - Browse HD Movies | Streaminal TV',
  description: 'Watch thousands of movies online free in HD. Browse by genre, rating, and year. Stream popular and trending movies without subscription on Streaminal TV.',
  openGraph: {
    title: 'Watch Movies Online Free - Browse HD Movies | Streaminal TV',
    description: 'Watch thousands of movies online free in HD. Browse by genre, rating, and year without subscription.',
    type: 'website',
    siteName: 'Streaminal TV',
  },
  twitter: {
    card: 'summary',
    title: 'Watch Movies Online Free - Browse HD Movies | Streaminal TV',
    description: 'Watch thousands of movies online free in HD. Browse by genre, rating, and year.',
  },
};

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
