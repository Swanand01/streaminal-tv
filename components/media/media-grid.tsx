import { Media } from '@/lib/tmdb';
import { MediaCard } from './media-card';
import { cn } from '@/lib/utils';

interface MediaGridProps {
  items: Media[];
  emptyMessage?: string;
  showMediaType?: boolean;
  className?: string;
}

export function MediaGrid({
  items,
  emptyMessage = 'No results found',
  showMediaType = true,
  className,
}: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5',
        className
      )}
    >
      {items.map((item, index) => (
        <MediaCard
          key={`${item.id}-${index}`}
          media={item}
          variant="grid"
          showMediaType={showMediaType}
        />
      ))}
    </div>
  );
}
