'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Media, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroCarouselProps {
  items: Media[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-rotation
  useEffect(() => {
    if (!isHovering && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          // Loop back to start when reaching the end
          if (prev >= items.length - 1) return 0;
          return prev + 1;
        });
      }, 6000); // 6 seconds
      return () => clearInterval(interval);
    }
  }, [isHovering, items.length]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canGoForward) {
      goToNext();
    }
    if (isRightSwipe && canGoBack) {
      goToPrevious();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < items.length - 1;

  if (!items || items.length === 0) return null;

  const currentMedia = items[currentIndex];
  const mediaType = currentMedia?.media_type || 'movie';
  const route = mediaType === 'tv' ? 'tv-shows' : 'movies';
  const title = getTitle(currentMedia);
  const year = getReleaseYear(currentMedia);
  const rating = currentMedia.vote_average.toFixed(1);

  return (
    <section
      className="group/hero relative h-[70vh] max-h-200 min-h-150 w-full md:h-[80vh]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Transitions */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {item.backdrop_path && (
            <>
              <Image
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={getTitle(item)}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="from-background via-background/80 to-background/20 absolute inset-0 bg-linear-to-r" />
              <div className="from-background via-background/50 to-background/0 absolute inset-0 bg-linear-to-t" />
            </>
          )}
        </div>
      ))}

      {/* Content with Animations */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div
            key={currentIndex}
            className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl space-y-4 duration-700 md:space-y-6"
          >
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
              {currentMedia.overview}
            </p>

            <Button asChild size="lg" className="gap-2 font-semibold">
              <Link href={`/${route}/${generateSlug(title, currentMedia.id)}`}>
                <Play className="h-5 w-5 fill-current" />
                Play Now
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Arrow Navigation - Show on hover and only when can navigate */}
      {items.length > 1 && canGoBack && (
        <button
          onClick={goToPrevious}
          className="from-background via-background/80 to-background/0 pointer-events-none absolute top-0 left-0 z-10 flex h-full items-center bg-linear-to-r px-4 opacity-0 transition-opacity group-hover/hero:opacity-100 [@media(hover:hover)]:pointer-events-auto md:px-8"
          aria-label="Previous slide"
        >
          <div className="bg-background/80 hover:bg-background rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronLeft className="text-foreground h-8 w-8 md:h-10 md:w-10" />
          </div>
        </button>
      )}

      {items.length > 1 && canGoForward && (
        <button
          onClick={goToNext}
          className="from-background via-background/80 to-background/0 pointer-events-none absolute top-0 right-0 z-10 flex h-full items-center bg-linear-to-l px-4 opacity-0 transition-opacity group-hover/hero:opacity-100 [@media(hover:hover)]:pointer-events-auto md:px-8"
          aria-label="Next slide"
        >
          <div className="bg-background/80 hover:bg-background rounded-full p-2 backdrop-blur-sm transition-colors">
            <ChevronRight className="text-foreground h-8 w-8 md:h-10 md:w-10" />
          </div>
        </button>
      )}
    </section>
  );
}
