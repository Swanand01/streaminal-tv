import Link from 'next/link';
import Image from 'next/image';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
import { Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  media: Media;
}

export function HeroBanner({ media }: HeroBannerProps) {
  const mediaType = media?.media_type || 'movie';
  const route = mediaType === 'tv' ? 'tv-shows' : 'movies';
  const title = getTitle(media);
  const year = getReleaseYear(media);
  const rating = media.vote_average.toFixed(1);

  return (
    <section className="relative h-[70vh] min-h-150 w-full md:h-[80vh]">
      {media.backdrop_path && (
        <>
          <Image
            src={getImageUrl(media.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="from-background via-background/80 to-background/20 absolute inset-0 bg-linear-to-r" />
          <div className="from-background via-background/50 to-background/0 absolute inset-0 bg-linear-to-t" />
        </>
      )}

      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="text-muted-foreground flex items-center gap-3 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <Star className="fill-primary text-primary h-4 w-4" />
                <span className="text-foreground font-semibold">{rating}</span>
              </div>
              {year && <span>{year}</span>}
              <span className="bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium uppercase">
                {mediaType}
              </span>
            </div>

            <h1 className="text-foreground text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="text-foreground/90 line-clamp-3 text-base leading-relaxed md:line-clamp-4 md:text-lg">
              {media.overview}
            </p>

            <Button asChild size="lg" className="gap-2 font-semibold">
              <Link href={`/${route}/${generateSlug(title, media.id)}`}>
                <Play className="h-5 w-5 fill-current" />
                Play Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
