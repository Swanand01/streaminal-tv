import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { HeroBannerSkeleton } from '@/components/skeletons/hero-banner-skeleton';
import { MediaCarouselSkeleton } from '@/components/skeletons/media-carousel-skeleton';
import {
  HeroAndTrendingSection,
  PopularMoviesSection,
  PopularTVShowsSection,
} from './home-sections';

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
