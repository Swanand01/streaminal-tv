import { Media } from '@/lib/tmdb';
import { MediaCard } from '@/components/media/media-card';

interface SimilarTVShowsSectionProps {
  shows?: Media[];
}

export function SimilarTVShowsSection({ shows }: SimilarTVShowsSectionProps) {
  if (!shows || shows.length === 0) return null;

  return (
    <aside className="w-full lg:block lg:w-80 xl:w-96">
      <h2 className="mb-4 text-xl font-bold">More Like This</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {shows.slice(0, 6).map((item) => (
          <MediaCard key={item.id} media={item} variant="grid" showMediaType={false} />
        ))}
      </div>
    </aside>
  );
}
