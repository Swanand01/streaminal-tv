import { HeroBanner } from '@/components/hero-banner';
import { MediaCarousel } from '@/components/media-carousel';
import { getTrending, getPopularMovies, getPopularTVShows } from '@/lib/tmdb';

export async function HeroSection() {
    const trending = await getTrending('all', 'day').catch(() => []);
    const featuredItem = trending?.[Math.floor(Math.random() * Math.min(5, trending.length))];

    if (!featuredItem) {
        return null;
    }

    return <HeroBanner media={featuredItem} />;
}

export async function TrendingSection() {
    const trending = await getTrending('all', 'day').catch(() => []);

    if (!trending || trending.length === 0) {
        return null;
    }

    return <MediaCarousel title="Trending Now" items={trending} />;
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
