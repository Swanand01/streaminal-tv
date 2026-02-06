'use client';

import { Media } from '@/lib/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { MediaCard } from './media-card';

interface MediaCarouselProps {
  title: string;
  items: Media[];
  showMediaType?: boolean;
}

export function MediaCarousel({ title, items, showMediaType = true }: MediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="group/carousel relative mb-8">
      <div className="container mx-auto">
        <h2 className="text-foreground mb-4 px-4 text-xl font-bold md:px-8 md:text-2xl lg:px-12">
          {title}
        </h2>

        <div className="relative px-4 md:px-8 lg:px-12">
          <button
            onClick={() => scroll('left')}
            className="from-background via-background/80 to-background/0 absolute top-0 left-4 z-10 flex h-full items-center bg-gradient-to-r px-2 opacity-0 transition-opacity group-hover/carousel:opacity-100 md:left-8 md:px-4 lg:left-12"
            aria-label="Scroll left"
          >
            <div className="bg-background/80 hover:bg-background rounded-full p-1 backdrop-blur-sm transition-colors">
              <ChevronLeft className="text-foreground h-6 w-6 md:h-8 md:w-8" />
            </div>
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto overflow-y-hidden py-2 md:gap-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <MediaCard key={item.id} media={item} showMediaType={showMediaType} />
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="from-background via-background/80 to-background/0 absolute top-0 right-4 z-10 flex h-full items-center bg-gradient-to-l px-2 opacity-0 transition-opacity group-hover/carousel:opacity-100 md:right-8 md:px-4 lg:right-12"
            aria-label="Scroll right"
          >
            <div className="bg-background/80 hover:bg-background rounded-full p-1 backdrop-blur-sm transition-colors">
              <ChevronRight className="text-foreground h-6 w-6 md:h-8 md:w-8" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
