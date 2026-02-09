import type { Video } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';

interface VideosListProps {
  videos?: Video[];
  limit?: number;
}

export function VideosList({ videos, limit = 12 }: VideosListProps) {
  if (!videos || videos.length === 0) {
    return <p className="text-muted-foreground text-center">No videos available</p>;
  }

  const displayedVideos = videos.filter((video) => video.site === 'YouTube').slice(0, limit);

  if (displayedVideos.length === 0) {
    return <p className="text-muted-foreground text-center">No videos available</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {displayedVideos.map((video) => (
        <div key={video.id} className="border-border overflow-hidden rounded-lg border">
          <div className="bg-muted relative aspect-video overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <Badge
              variant="secondary"
              className="pointer-events-none absolute top-2 right-2 backdrop-blur-sm"
            >
              {video.type}
            </Badge>
          </div>
          <div className="p-3">
            <p className="text-md line-clamp-2 leading-tight font-semibold">{video.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
