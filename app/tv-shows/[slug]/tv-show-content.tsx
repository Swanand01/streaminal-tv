'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaPlayer } from '@/components/media-player';
import { MediaOverview } from '@/components/media-overview';
import { TVShowTabs } from './tv-show-tabs';
import { SimilarTVShowsSection } from './similar-tv-shows-section';
import { getTitle } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
import type { MediaDetails, Season, Media, Video, Review } from '@/lib/tmdb';

interface TVShowContentProps {
  tvId: number;
  initialShow: MediaDetails;
  initialSeasonData: Season;
  similarShows: Media[];
  videos: Video[];
  reviews: Review[];
  initialSeason: number;
  initialEpisode: number;
}

export function TVShowContent({
  tvId,
  initialShow,
  initialSeasonData,
  similarShows,
  videos,
  reviews,
  initialSeason,
  initialEpisode,
}: TVShowContentProps) {
  const router = useRouter();
  const slug = generateSlug(getTitle(initialShow), tvId);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);

  const handleSeasonChange = (season: number) => {
    setSelectedEpisode(1);
    router.push(`/tv-shows/${slug}?season=${season}&episode=1`);
  };

  const handleEpisodeChange = (episode: number) => {
    setSelectedEpisode(episode);
    const url = `/tv-shows/${slug}?season=${initialSeason}&episode=${episode}`;
    window.history.replaceState(null, '', url);
  };

  const episodeOverview = initialSeasonData?.episodes.find(
    (ep) => ep.episode_number === selectedEpisode
  )?.overview;

  return (
    <>
      {/* Video Player Section */}
      <div className="relative w-full pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <MediaPlayer type="tv" mediaId={tvId} season={initialSeason} episode={selectedEpisode} />
        </div>
      </div>

      {/* Show Info with Sidebar Layout */}
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <MediaOverview media={initialShow} overviewText={episodeOverview} />
            <TVShowTabs
              show={initialShow}
              selectedSeason={initialSeason}
              selectedEpisode={selectedEpisode}
              seasonData={initialSeasonData}
              videos={videos}
              reviews={reviews}
              onSeasonChange={handleSeasonChange}
              onEpisodeChange={handleEpisodeChange}
            />
          </div>

          {/* Recommendations Sidebar */}
          <SimilarTVShowsSection shows={similarShows} />
        </div>
      </div>
    </>
  );
}
