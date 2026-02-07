'use client';

import { CastList } from '@/components/cast-list';
import { VideosList } from '@/components/videos-list';
import { ReviewsList } from '@/components/reviews-list';
import { EpisodesList } from '@/app/tv-shows/[slug]/episodes-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { MediaDetails, Season, Video, Review } from '@/lib/tmdb';

interface TVShowTabsProps {
  show: MediaDetails;
  selectedSeason: number;
  selectedEpisode: number;
  seasonData: Season;
  videos?: Video[];
  reviews?: Review[];
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

export function TVShowTabs({
  show,
  selectedSeason,
  selectedEpisode,
  seasonData,
  videos,
  reviews,
  onSeasonChange,
  onEpisodeChange,
}: TVShowTabsProps) {
  return (
    <Tabs defaultValue="episodes" className="mt-8">
      <TabsList className="overflow-x-auto">
        <TabsTrigger value="episodes">Episodes</TabsTrigger>
        <TabsTrigger value="cast">Cast</TabsTrigger>
        {videos && videos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
        {reviews && reviews.length > 0 && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
      </TabsList>

      {/* Episodes Tab */}
      <TabsContent value="episodes" className="mt-6">
        <EpisodesList
          show={show}
          selectedSeason={selectedSeason}
          selectedEpisode={selectedEpisode}
          seasonData={seasonData}
          onSeasonChange={onSeasonChange}
          onEpisodeChange={onEpisodeChange}
        />
      </TabsContent>

      {/* Cast Tab */}
      <TabsContent value="cast" className="mt-6">
        {show.credits?.cast && <CastList cast={show.credits.cast} limit={20} />}
      </TabsContent>

      {/* Videos Tab */}
      <TabsContent value="videos" className="mt-6">
        <VideosList videos={videos} />
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="mt-6">
        <ReviewsList reviews={reviews} />
      </TabsContent>
    </Tabs>
  );
}
