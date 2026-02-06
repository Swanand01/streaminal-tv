'use client';

import Link from 'next/link';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import { useRef } from 'react';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastListProps {
  cast: CastMember[];
  limit?: number;
}

export function CastList({ cast, limit = 20 }: CastListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!cast || cast.length === 0) {
    return null;
  }

  const displayedCast = cast.slice(0, limit);

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Cast</h2>
      <div className="group/cast relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 z-10 flex h-full items-center bg-gradient-to-r from-background via-background/80 to-background/0 px-2 opacity-0 transition-opacity group-hover/cast:opacity-100"
          aria-label="Scroll left"
        >
          <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayedCast.map((actor) => (
            <Link
              key={actor.id}
              href={`/person/${actor.id}`}
              className="group flex flex-shrink-0 flex-col items-center gap-2"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted ring-2 ring-transparent transition-all group-hover:ring-primary/50">
                {actor.profile_path ? (
                  <img
                    src={getImageUrl(actor.profile_path, 'w500')}
                    alt={actor.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="w-20 text-center">
                <p className="line-clamp-2 text-xs font-medium leading-tight group-hover:text-primary">
                  {actor.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 z-10 flex h-full items-center bg-gradient-to-l from-background via-background/80 to-background/0 px-2 opacity-0 transition-opacity group-hover/cast:opacity-100"
          aria-label="Scroll right"
        >
          <div className="rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-background">
            <ChevronRight className="h-5 w-5 text-foreground" />
          </div>
        </button>
      </div>
    </div>
  );
}
