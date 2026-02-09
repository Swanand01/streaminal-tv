import { MediaDetails, getTitle, getReleaseYear } from '@/lib/tmdb';
import { Star, Calendar, Clock, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MediaOverviewProps {
  media: MediaDetails;
  overviewText?: string;
}

export function MediaOverview({ media, overviewText }: MediaOverviewProps) {
  const title = getTitle(media);
  const year = getReleaseYear(media);
  const overview = overviewText || media.overview;

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{title}</h1>
      <div className="text-muted-foreground text-md flex flex-wrap items-center gap-4">
        {year && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
        )}
        {media.vote_average > 0 && (
          <div className="flex items-center gap-1">
            <Star className="fill-primary text-primary h-4 w-4" />
            <span className="text-foreground font-medium">{media.vote_average.toFixed(1)}</span>
          </div>
        )}
        {media.runtime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {Math.floor(media.runtime / 60)}h {media.runtime % 60}m
            </span>
          </div>
        )}
        {media.status && !media.runtime && (
          <div className="flex items-center gap-1">
            <Tv className="h-4 w-4" />
            <span>{media.status}</span>
          </div>
        )}
        {media.number_of_seasons && (
          <span>
            {media.number_of_seasons} {media.number_of_seasons === 1 ? 'Season' : 'Seasons'}
          </span>
        )}
      </div>

      {media.genres && media.genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {media.genres.map((genre) => (
            <Badge key={genre.id} variant="outline">
              {genre.name}
            </Badge>
          ))}
        </div>
      )}

      {overview && (
        <p className="text-foreground/90 mt-4 text-lg leading-relaxed text-pretty">{overview}</p>
      )}
    </div>
  );
}
