import { Navigation } from '@/components/navigation';
import { HeroBanner } from '@/components/hero-banner';
import { MediaCarousel } from '@/components/media-carousel';
import { getTrending, getPopularMovies, getPopularTVShows } from '@/lib/tmdb';

export default async function HomePage() {
  const [trendingAll, popularMovies, popularTVShows] = await Promise.all([
    getTrending('all', 'day'),
    getPopularMovies(),
    getPopularTVShows(),
  ]);

  // Get a random featured item from trending for the hero
  const featuredItem = trendingAll.results[Math.floor(Math.random() * Math.min(5, trendingAll.results.length))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroBanner media={featuredItem} />
        
        <div className="relative z-10 -mt-32 space-y-12 pb-20">
          <MediaCarousel
            title="Trending Now"
            items={trendingAll.results}
          />
          
          <MediaCarousel
            title="Popular Movies"
            items={popularMovies.results}
          />
          
          <MediaCarousel
            title="Popular TV Shows"
            items={popularTVShows.results}
          />
        </div>
      </main>
    </div>
  );
}
