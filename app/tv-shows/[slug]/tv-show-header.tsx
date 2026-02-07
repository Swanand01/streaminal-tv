import { MediaDetails } from '@/lib/tmdb';
import { Star, Calendar, Tv } from 'lucide-react';

interface TVShowHeaderProps {
  show: MediaDetails;
  episodeOverview?: string;
}

export function TVShowHeader({ show, episodeOverview }: TVShowHeaderProps) {
  const title = show.name || 'Untitled';
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{title}</h1>
      <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
        {year && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
        )}
        {show.vote_average > 0 && (
          <div className="flex items-center gap-1">
            <Star className="fill-primary text-primary h-4 w-4" />
            <span className="text-foreground font-medium">{show.vote_average.toFixed(1)}</span>
          </div>
        )}
        {show.status && (
          <div className="flex items-center gap-1">
            <Tv className="h-4 w-4" />
            <span>{show.status}</span>
          </div>
        )}
        {show.number_of_seasons && (
          <span>
            {show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}
          </span>
        )}
      </div>

      {show.genres && show.genres.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {show.genres.map((genre) => (
            <span key={genre.id} className="bg-muted rounded-full px-3 py-1 text-xs font-medium">
              {genre.name}
            </span>
          ))}
        </div>
      )}

      {episodeOverview ? (
        <p className="text-foreground/90 mt-4 leading-relaxed text-pretty">{episodeOverview}</p>
      ) : (
        show.overview && (
          <p className="text-foreground/90 mt-4 leading-relaxed text-pretty">{show.overview}</p>
        )
      )}
    </div>
  );
}
