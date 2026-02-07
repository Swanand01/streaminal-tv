'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Tv } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import type { MediaDetails, Season } from '@/lib/tmdb';

interface EpisodesListProps {
  show: MediaDetails;
  initialSeason: number;
  initialEpisode: number;
  seasonData: Season;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

export function EpisodesList({
  show,
  initialSeason,
  initialEpisode,
  seasonData,
  onSeasonChange,
  onEpisodeChange,
}: EpisodesListProps) {
  const [episodesShown, setEpisodesShown] = useState(12);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);

  const handleSeasonChange = (value: string) => {
    const season = parseInt(value);
    setSelectedSeason(season);
    setSelectedEpisode(1);
    setEpisodesShown(12);
    onSeasonChange(season);
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
    onEpisodeChange(episodeNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1).map(
              (season) => (
                <SelectItem key={season} value={season.toString()}>
                  Season {season}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      {seasonData && seasonData.episodes ? (
        <>
          <div className="grid grid-cols-2 items-start gap-2 sm:gap-4 xl:grid-cols-3">
            {seasonData.episodes.slice(0, episodesShown).map((episode) => (
              <button
                key={episode.id}
                onClick={() => handleEpisodeClick(episode.episode_number)}
                className={`group relative overflow-hidden rounded-lg border text-left transition-all ${
                  selectedEpisode === episode.episode_number
                    ? 'border-primary ring-primary ring-2'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="bg-muted relative aspect-video overflow-hidden">
                  {episode.still_path ? (
                    <Image
                      src={getImageUrl(episode.still_path, 'w500')}
                      alt={episode.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center">
                      <Tv className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                  )}
                  {episode.vote_average && episode.vote_average > 0 && (
                    <div className="bg-background/90 absolute top-1 right-1 flex items-center gap-1 rounded-md px-1.5 py-0.5 backdrop-blur-sm sm:top-2 sm:right-2 sm:px-2 sm:py-1">
                      <Star className="fill-primary text-primary h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span className="text-foreground text-[10px] font-semibold sm:text-xs">
                        {episode.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3">
                  <p className="line-clamp-2 text-xs font-semibold sm:text-sm">
                    {episode.episode_number}. {episode.name}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {seasonData.episodes.length > episodesShown && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={() => setEpisodesShown((prev) => prev + 12)}>
                Load More Episodes ({seasonData.episodes.length - episodesShown} remaining)
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-center">No episodes available</p>
      )}
    </div>
  );
}
