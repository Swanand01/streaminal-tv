import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { HeroBannerSkeleton } from '@/components/hero-banner-skeleton';
import { MediaCarouselSkeleton } from '@/components/media-carousel-skeleton';
import {
  HeroSection,
  TrendingSection,
  PopularMoviesSection,
  PopularTVShowsSection
} from './home-sections';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <Suspense fallback={<HeroBannerSkeleton />}>
          <HeroSection />
        </Suspense>

        <div className="relative z-10 -mt-20 space-y-12 pb-20">
          <Suspense fallback={<MediaCarouselSkeleton />}>
            <TrendingSection />
          </Suspense>

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
