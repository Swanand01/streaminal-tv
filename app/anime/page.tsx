import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { MoviesContentSkeleton } from '@/components/skeletons/movies-content-skeleton';
import { Anime } from './anime';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch Anime Online Free - Browse HD Anime | Streaminal',
  description:
    'Watch thousands of anime series online free in HD. Browse popular and trending anime without subscription on Streaminal.',
  alternates: {
    canonical: '/anime',
  },
  openGraph: {
    title: 'Watch Anime Online Free - Browse HD Anime | Streaminal',
    description: 'Watch thousands of anime series online free in HD without subscription.',
    type: 'website',
    siteName: 'Streaminal',
  },
  twitter: {
    card: 'summary',
    title: 'Watch Anime Online Free - Browse HD Anime | Streaminal',
    description: 'Watch thousands of anime series online free in HD.',
  },
};

export default function AnimePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<MoviesContentSkeleton />}>
        <Anime />
      </Suspense>
    </div>
  );
}
