'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MatchSource, getMatchStreams } from '@/lib/sports';
import { Button } from '@/components/ui/button';

interface SportsPlayerProps {
  sources: MatchSource[];
}

export function SportsPlayer({ sources }: SportsPlayerProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [streamIndex, setStreamIndex] = useState(0);

  const currentSource = sources[sourceIndex];

  const { data: streams = [], isLoading } = useQuery({
    queryKey: ['streams', currentSource?.source, currentSource?.id],
    queryFn: () => getMatchStreams(currentSource.source, currentSource.id),
    enabled: !!currentSource,
    staleTime: 5 * 60 * 1000,
  });

  // Reset stream selection when source changes
  useEffect(() => {
    setStreamIndex(0);
  }, [sourceIndex]);

  const currentStream = streams[streamIndex];

  if (sources.length === 0) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center rounded-lg bg-black">
        <p className="text-muted-foreground">No streams available for this match.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-black">
            <p className="text-muted-foreground text-sm">Loading stream...</p>
          </div>
        ) : currentStream ? (
          <iframe
            key={`${sourceIndex}-${streamIndex}`}
            src={currentStream.embedUrl}
            className="h-full w-full rounded-lg"
            allowFullScreen
            allow="autoplay; fullscreen"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-black">
            <p className="text-muted-foreground text-sm">No streams available for this source.</p>
          </div>
        )}
      </div>

      {/* Source selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Source:</span>
        {sources.map((source, index) => (
          <Button
            key={`${source.source}-${source.id}`}
            variant={index === sourceIndex ? 'default' : 'secondary'}
            size="lg"
            onClick={() => setSourceIndex(index)}
          >
            {source.source.charAt(0).toUpperCase() + source.source.slice(1)}
          </Button>
        ))}
      </div>

      {/* Stream selector (language / HD) */}
      {streams.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">Stream:</span>
          {streams.map((stream, index) => (
            <Button
              key={`${stream.source}-${stream.streamNo}-${stream.language}`}
              variant={index === streamIndex ? 'default' : 'secondary'}
              size="lg"
              onClick={() => setStreamIndex(index)}
            >
              {stream.language} {stream.hd ? 'HD' : ''} {stream.streamNo}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
