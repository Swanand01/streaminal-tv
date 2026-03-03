import Link from 'next/link';
import Image from 'next/image';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
import { Star, Film, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MediaCardProps {
  media: Media;
  variant?: 'grid' | 'carousel';
  showMediaType?: boolean;
}

export function MediaCard({ media, variant = 'carousel', showMediaType = true }: MediaCardProps) {
  const mediaType = media.media_type || 'movie';
  const route = mediaType === 'tv' ? 'tv-shows' : 'movies';
  const title = getTitle(media);
  const href = `/${route}/${generateSlug(title, media.id)}`;
  const year = getReleaseYear(media);
  const rating = media.vote_average.toFixed(1);

  const widthClass = variant === 'grid' ? 'w-full ' : 'w-[160px] flex-shrink-0 md:w-[200px]';

  return (
    <div className={`group relative ${widthClass}`}>
      <Link href={href}>
        <div className="bg-muted relative aspect-2/3 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
          {media.poster_path ? (
            <Image
              src={getImageUrl(media.poster_path, 'w500')}
              alt={title}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 250px"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              No Image
            </div>
          )}

          {showMediaType && (
            <Badge variant="secondary" className="absolute top-2 left-2 backdrop-blur-sm">
              {mediaType === 'tv' ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
              {mediaType === 'tv' ? 'TV' : 'Movie'}
            </Badge>
          )}

          {media.vote_average > 0 && (
            <Badge variant="secondary" className="absolute top-2 right-2 backdrop-blur-sm">
              <Star className="fill-primary text-primary h-3 w-3" />
              {rating}
            </Badge>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <h3 className="text-foreground text-md line-clamp-1 leading-tight font-medium">
            {title}
          </h3>
          {year && <p className="text-muted-foreground text-sm">{year}</p>}
        </div>
      </Link>
    </div>
  );
}
