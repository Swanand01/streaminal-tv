import { HeroBanner } from '@/components/hero-banner';
import { MediaCarousel } from '@/components/media/media-carousel';
import { getTrending, getPopularMovies, getPopularTVShows } from '@/lib/tmdb';

export async function HeroAndTrendingSection() {
  const trending = await getTrending('all', 'day').catch(() => []);

  if (!trending || trending.length === 0) {
    return null;
  }

  const featuredItem = trending[1];

  return (
    <>
      {featuredItem && <HeroBanner media={featuredItem} />}
      <div className="relative z-10 -mt-20">
        <MediaCarousel title="Trending Now" items={trending} />
      </div>
    </>
  );
}

export async function PopularMoviesSection() {
  const popularMovies = await getPopularMovies().catch(() => []);

  if (!popularMovies || popularMovies.length === 0) {
    return null;
  }

  return <MediaCarousel title="Popular Movies" items={popularMovies} showMediaType={false} />;
}

export async function PopularTVShowsSection() {
  const popularTVShows = await getPopularTVShows().catch(() => []);

  if (!popularTVShows || popularTVShows.length === 0) {
    return null;
  }

  return <MediaCarousel title="Popular TV Shows" items={popularTVShows} showMediaType={false} />;
}
