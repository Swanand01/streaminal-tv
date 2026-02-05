import Link from 'next/link';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface MediaCardProps {
  media: Media;
  variant?: 'grid' | 'carousel';
}

export function MediaCard({ media, variant = 'carousel' }: MediaCardProps) {
  const mediaType = media.media_type || 'movie';
  const href = `/${mediaType}/${media.id}`;
  const title = getTitle(media);
  const year = getReleaseYear(media);
  const rating = media.vote_average.toFixed(1);

  const widthClass = variant === 'grid' ? 'w-full' : 'w-[160px] flex-shrink-0 md:w-[200px]';

  return (
    <div className={`group relative ${widthClass}`}>
      <Link href={href}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted transition-transform duration-300 group-hover:scale-105">
          {media.poster_path ? (
            <img
              src={getImageUrl(media.poster_path, 'w500')}
              alt={title}
              className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-background/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-1 text-xs text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="font-medium">{rating}</span>
            </div>
          </div>
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
