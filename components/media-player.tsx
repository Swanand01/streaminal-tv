'use client';

import { useState } from 'react';
import sources from '@/config/sources.json';

type MediaPlayerProps =
  | { type: 'movie'; mediaId: number }
  | { type: 'tv'; mediaId: number; season: number; episode: number };

export function MediaPlayer(props: MediaPlayerProps) {
  const [sourceIndex, setSourceIndex] = useState(0);

  const sourceList = props.type === 'movie' ? sources.movie : sources.tv;

  let currentUrl = sourceList[sourceIndex].url.replace('{id}', String(props.mediaId));
  let iframeKey: string = String(sourceIndex);

  if (props.type === 'tv') {
    currentUrl = currentUrl
      .replace('{season}', String(props.season))
      .replace('{episode}', String(props.episode));
    iframeKey = `${sourceIndex}-${props.season}-${props.episode}`;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full">
        <iframe
          key={iframeKey}
          src={currentUrl}
          className="h-full w-full rounded-lg"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>

      {/* Source selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Source:</span>
        {sourceList.map((source, index) => (
          <button
            key={source.name}
            onClick={() => setSourceIndex(index)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
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
