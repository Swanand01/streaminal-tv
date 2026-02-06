import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { TVShowSkeleton } from '@/components/skeletons/tv-show-skeleton';
import {
  getTVDetails,
  getTVSeason,
  getSimilarTVShows,
  getTVVideos,
  getTVReviews,
} from '@/lib/tmdb';
import { TVShowContent } from './tv-show-content';

interface TVShowPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
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

  return (
    <TVShowContent
      tvId={tvId}
      initialShow={show}
      initialSeasonData={seasonData}
      similarShows={similarShows}
      videos={videos}
      reviews={reviews}
      initialSeason={season}
      initialEpisode={episode}
    />
  );
}

export default async function TVShowPage({ params, searchParams }: TVShowPageProps) {
  const { id } = await params;
  const search = await searchParams;
  const tvId = parseInt(id);
  const season = search.season ? parseInt(search.season) : 1;
  const episode = search.episode ? parseInt(search.episode) : 1;

  if (isNaN(tvId)) {
    return (
      <div className="bg-background min-h-screen">
        <Navigation />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-xl">Invalid TV show ID</p>
          <p className="text-muted-foreground text-sm">Please check the URL and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<TVShowSkeleton />}>
        <TVShowData tvId={tvId} season={season} episode={episode} />
      </Suspense>
    </div>
  );
}
