import { Media } from '@/lib/tmdb';
import { MediaCard } from './media-card';

interface MediaGridProps {
  items: Media[];
  emptyMessage?: string;
}

export function MediaGrid({ items, emptyMessage = 'No results found' }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={item.id} media={item} />
      ))}
    </div>
  );
}
