import { Navigation } from '@/components/navigation';
import { HeroBanner } from '@/components/hero-banner';
import { MediaCarousel } from '@/components/media-carousel';
import { getTrending, getPopularMovies, getPopularTVShows } from '@/lib/tmdb';

export default async function HomePage() {
  const [trendingAll, popularMovies, popularTVShows] = await Promise.all([
    getTrending('all', 'day').catch((e) => {
      console.log('[v0] Error fetching trending:', e.message);
      return [];
    }),
    getPopularMovies().catch((e) => {
      console.log('[v0] Error fetching popular movies:', e.message);
      return [];
    }),
    getPopularTVShows().catch((e) => {
      console.log('[v0] Error fetching popular TV shows:', e.message);
      return [];
    }),
  ]);

  console.log('[v0] Trending data:', trendingAll?.length, 'items');
  console.log('[v0] Popular movies:', popularMovies?.length, 'items');
  console.log('[v0] Popular TV shows:', popularTVShows?.length, 'items');

  // Get a random featured item from trending for the hero
  const featuredItem = trendingAll?.[Math.floor(Math.random() * Math.min(5, trendingAll.length))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroBanner media={featuredItem} />
        
        <div className="relative z-10 -mt-32 space-y-12 px-4 pb-20 md:px-8 lg:px-12">
          {trendingAll && trendingAll.length > 0 && (
            <MediaCarousel
              title="Trending Now"
              items={trendingAll}
            />
          )}
          
          {popularMovies && popularMovies.length > 0 && (
            <MediaCarousel
              title="Popular Movies"
              items={popularMovies}
            />
          )}
          
          {popularTVShows && popularTVShows.length > 0 && (
            <MediaCarousel
              title="Popular TV Shows"
              items={popularTVShows}
            />
          )}
        </div>
      </main>
    </div>
  );
}
