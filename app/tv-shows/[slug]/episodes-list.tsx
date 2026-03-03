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
import { Badge } from '@/components/ui/badge';
import { getImageUrl } from '@/lib/tmdb';
import type { MediaDetails, Season } from '@/lib/tmdb';

interface EpisodesListProps {
  show: MediaDetails;
  selectedSeason: number;
  selectedEpisode: number;
  seasonData: Season;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
}

export function EpisodesList({
  show,
  selectedSeason,
  selectedEpisode,
  seasonData,
  onSeasonChange,
  onEpisodeChange,
}: EpisodesListProps) {
  const [episodesShown, setEpisodesShown] = useState(12);

  const handleSeasonChange = (value: string) => {
    const season = parseInt(value);
    setEpisodesShown(12);
    onSeasonChange(season);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-45" size="lg">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1).map((season) => (
              <SelectItem key={season} value={season.toString()}>
                Season {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {seasonData && seasonData.episodes ? (
        <>
          <div className="grid grid-cols-2 items-start gap-2 sm:gap-4 xl:grid-cols-3">
            {seasonData.episodes.slice(0, episodesShown).map((episode) => (
              <button
                key={episode.id}
                onClick={() => onEpisodeChange(episode.episode_number)}
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
                    <Badge
                      variant="secondary"
                      className="absolute top-1 right-1 backdrop-blur-sm sm:top-2 sm:right-2"
                    >
                      <Star className="fill-primary text-primary h-3 w-3" />
                      {episode.vote_average.toFixed(1)}
                    </Badge>
                  )}
                </div>
                <div className="p-2 sm:p-3">
                  <p className="sm:text-md line-clamp-2 text-sm font-semibold">
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
