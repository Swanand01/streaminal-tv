'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import { generateSlug } from '@/lib/utils';
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
      <div className="group/cast relative">
        <button
          onClick={() => scroll('left')}
          className="from-background via-background/80 to-background/0 absolute top-0 left-0 z-10 flex h-full items-center bg-linear-to-r px-2 opacity-0 transition-opacity group-hover/cast:opacity-100"
          aria-label="Scroll left"
        >
          <div className="bg-background/80 hover:bg-background rounded-full p-1 backdrop-blur-sm transition-colors">
            <ChevronLeft className="text-foreground h-5 w-5" />
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
              href={`/people/${generateSlug(actor.name, actor.id)}`}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <div className="bg-muted group-hover:ring-primary/50 relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-transparent transition-all">
                {actor.profile_path ? (
                  <Image
                    src={getImageUrl(actor.profile_path, 'w500')}
                    alt={actor.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="w-20 text-center">
                <p className="group-hover:text-primary line-clamp-2 text-sm leading-tight font-medium">
                  {actor.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="from-background via-background/80 to-background/0 absolute top-0 right-0 z-10 flex h-full items-center bg-linear-to-l px-2 opacity-0 transition-opacity group-hover/cast:opacity-100"
          aria-label="Scroll right"
        >
          <div className="bg-background/80 hover:bg-background rounded-full p-1 backdrop-blur-sm transition-colors">
            <ChevronRight className="text-foreground h-5 w-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
