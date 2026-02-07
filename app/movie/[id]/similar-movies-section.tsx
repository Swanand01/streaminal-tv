import { Media } from '@/lib/tmdb';
import { MediaCard } from '@/components/media/media-card';

interface SimilarMoviesSectionProps {
  movies?: Media[];
}

export function SimilarMoviesSection({ movies }: SimilarMoviesSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <aside className="w-full lg:block lg:w-80 xl:w-96">
      <h2 className="mb-4 text-xl font-bold">More Like This</h2>
      <div className="grid grid-cols-3 gap-3">
        {movies.slice(0, 6).map((item) => (
          <MediaCard key={item.id} media={item} variant="grid" showMediaType={false} />
        ))}
      </div>
    </aside>
  );
}
