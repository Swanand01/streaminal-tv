'use client';

import { useState } from 'react';
import sources from '@/config/sources.json';

interface TVShowPlayerProps {
  tvId: number;
  season: number;
  episode: number;
}

export function TVShowPlayer({ tvId, season, episode }: TVShowPlayerProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const currentUrl = sources.tv[sourceIndex].url
    .replace('{id}', String(tvId))
    .replace('{season}', String(season))
    .replace('{episode}', String(episode));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full">
        <iframe
          key={`${sourceIndex}-${season}-${episode}`}
          src={currentUrl}
          className="h-full w-full rounded-lg"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Source selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs">Source:</span>
        {sources.tv.map((source, index) => (
          <button
            key={source.name}
            onClick={() => setSourceIndex(index)}
            className={`rounded-md px-3 py-1 text-xs transition-colors ${
              index === sourceIndex
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>
    </div>
  );
}
