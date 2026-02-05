import Link from 'next/link';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  media: Media;
}

export function HeroBanner({ media }: HeroBannerProps) {
  const mediaType = media.media_type || 'movie';
  const title = getTitle(media);
  const year = getReleaseYear(media);
  const rating = media.vote_average.toFixed(1);

  return (
    <section className="relative h-[70vh] min-h-[500px] w-full md:h-[80vh]">
      {media.backdrop_path && (
        <>
          <img
            src={getImageUrl(media.backdrop_path, 'original')}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/0" />
        </>
      )}

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-[1920px] px-4 md:px-8 lg:px-12">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground md:text-base">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold text-foreground">{rating}</span>
              </div>
              {year && <span>{year}</span>}
              <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium uppercase text-foreground">
                {mediaType}
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="line-clamp-3 text-base leading-relaxed text-foreground/90 md:line-clamp-4 md:text-lg">
              {media.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 font-semibold">
                <Link href={`/${mediaType}/${media.id}`}>
                  <Play className="h-5 w-5 fill-current" />
                  Play Now
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="gap-2 font-semibold">
                <Link href={`/${mediaType}/${media.id}`}>
                  <Info className="h-5 w-5" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
