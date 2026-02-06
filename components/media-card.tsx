import Link from 'next/link';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { Star, Film, Tv } from 'lucide-react';

interface MediaCardProps {
  media: Media;
  variant?: 'grid' | 'carousel';
  showMediaType?: boolean;
}

export function MediaCard({ media, variant = 'carousel', showMediaType = true }: MediaCardProps) {
  const mediaType = media.media_type || 'movie';
  const href = `/${mediaType}/${media.id}`;
  const title = getTitle(media);
  const year = getReleaseYear(media);
  const rating = media.vote_average.toFixed(1);

  const widthClass = variant === 'grid' ? 'w-full max-w-[200px]' : 'w-[160px] flex-shrink-0 md:w-[200px]';

  return (
    <div className={`group relative ${widthClass}`}>
      <Link href={href}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted transition-transform duration-300 group-hover:scale-105">
          {media.poster_path ? (
            <img
              src={getImageUrl(media.poster_path, 'w500')}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          {showMediaType && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 backdrop-blur-sm">
              {mediaType === 'tv' ? (
                <Tv className="h-3 w-3 text-foreground" />
              ) : (
                <Film className="h-3 w-3 text-foreground" />
              )}
              <span className="text-xs font-semibold text-foreground">
                {mediaType === 'tv' ? 'TV' : 'Movie'}
              </span>
            </div>
          )}
          
          {media.vote_average > 0 && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-semibold text-foreground">{rating}</span>
            </div>
          )}
        </div>
        
        <div className="mt-2 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium leading-tight text-foreground">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-muted-foreground">{year}</p>
          )}
        </div>
      </Link>
    </div>
  );
}
