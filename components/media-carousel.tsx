'use client';

import { Media } from '@/lib/tmdb';
import { MediaCard } from './media-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface MediaCarouselProps {
  title: string;
  items: Media[];
}

export function MediaCarousel({ title, items }: MediaCarouselProps) {
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
      <h2 className="mb-4 px-4 text-xl font-bold text-foreground md:px-8 md:text-2xl lg:px-12">
        {title}
      </h2>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 z-10 flex h-full items-center bg-gradient-to-r from-background via-background/80 to-background/0 px-2 opacity-0 transition-opacity group-hover/carousel:opacity-100 md:px-4"
          aria-label="Scroll left"
        >
          <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background">
            <ChevronLeft className="h-6 w-6 text-foreground md:h-8 md:w-8" />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto overflow-y-hidden px-4 md:gap-4 md:px-8 lg:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <MediaCard key={item.id} media={item} />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 z-10 flex h-full items-center bg-gradient-to-l from-background via-background/80 to-background/0 px-2 opacity-0 transition-opacity group-hover/carousel:opacity-100 md:px-4"
          aria-label="Scroll right"
        >
          <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background">
            <ChevronRight className="h-6 w-6 text-foreground md:h-8 md:w-8" />
          </div>
        </button>
      </div>
    </section>
  );
}
