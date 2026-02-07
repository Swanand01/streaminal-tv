import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { HeroBannerSkeleton } from '@/components/skeletons/hero-banner-skeleton';
import { MediaCarouselSkeleton } from '@/components/skeletons/media-carousel-skeleton';
import {
  HeroAndTrendingSection,
  PopularMoviesSection,
  PopularTVShowsSection,
} from './home-sections';

export const metadata: Metadata = {
  title: 'Streaminal TV - Watch Movies & TV Shows Online Free in HD',
  description: 'Stream thousands of movies and TV shows online free in HD. Watch trending content, popular films, and TV series without subscription on Streaminal TV.',
  openGraph: {
    title: 'Streaminal TV - Watch Movies & TV Shows Online Free in HD',
    description: 'Stream thousands of movies and TV shows online free in HD. Watch trending content without subscription.',
    type: 'website',
    siteName: 'Streaminal TV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streaminal TV - Watch Movies & TV Shows Online Free in HD',
    description: 'Stream thousands of movies and TV shows online free in HD.',
  },
};

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main>
        <Suspense
          fallback={
            <>
              <HeroBannerSkeleton />
              <div className="relative z-10 -mt-20">
                <MediaCarouselSkeleton />
              </div>
            </>
          }
        >
          <HeroAndTrendingSection />
        </Suspense>

        <div className="relative z-10 space-y-12 pb-20">
          <Suspense fallback={<MediaCarouselSkeleton />}>
            <PopularMoviesSection />
          </Suspense>

          <Suspense fallback={<MediaCarouselSkeleton />}>
            <PopularTVShowsSection />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
