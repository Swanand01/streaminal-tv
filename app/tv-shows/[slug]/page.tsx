import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { TVShowDetailsSkeleton } from '@/components/skeletons/tv-show-details-skeleton';
import {
  getTVDetails,
  getTVSeason,
  getSimilarTVShows,
  getTVVideos,
  getTVReviews,
} from '@/lib/tmdb';
import { TVShowContent } from './tv-show-content';
import { generateTVShowMetadata } from '@/lib/seo';
import { extractIdFromSlug } from '@/lib/utils';

interface TVShowPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}

export async function generateMetadata({ params }: TVShowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tvId = extractIdFromSlug(slug);
  if (!tvId) {
    return {
      title: 'TV Show Not Found | Streaminal TV',
      description: 'The requested TV show could not be found.',
    };
  }
  return generateTVShowMetadata(tvId);
}

async function TVShowData({
  tvId,
  season,
  episode,
}: {
  tvId: number;
  season: number;
  episode: number;
}) {
  const [show, seasonData, similarShows, videos, reviews] = await Promise.all([
    getTVDetails(tvId).catch(() => null),
    getTVSeason(tvId, season).catch(() => null),
    getSimilarTVShows(tvId).catch(() => []),
    getTVVideos(tvId).catch(() => []),
    getTVReviews(tvId).catch(() => []),
  ]);

  if (!show || !seasonData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">TV show not found</p>
      </div>
    );
  }

  // Clamp episode to valid range
  const maxEpisode = seasonData.episodes?.length || 1;
  const validEpisode = Math.min(Math.max(1, episode), maxEpisode);

  return (
    <TVShowContent
      tvId={tvId}
      initialShow={show}
      initialSeasonData={seasonData}
      similarShows={similarShows}
      videos={videos}
      reviews={reviews}
      initialSeason={season}
      initialEpisode={validEpisode}
    />
  );
}

export default async function TVShowPage({ params, searchParams }: TVShowPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const tvId = extractIdFromSlug(slug);
  const season = Math.max(1, parseInt(search.season || '1') || 1);
  const episode = Math.max(1, parseInt(search.episode || '1') || 1);

  if (!tvId) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-xl">TV show not found</p>
          <p className="text-muted-foreground text-sm">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<TVShowDetailsSkeleton />}>
        <TVShowData tvId={tvId} season={season} episode={episode} />
      </Suspense>
    </div>
  );
}
