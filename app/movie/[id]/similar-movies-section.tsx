import Image from 'next/image';
import { Media } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface SimilarMoviesSectionProps {
  movies?: Media[];
  variant?: 'mobile' | 'sidebar';
}

export function SimilarMoviesSection({ movies }: SimilarMoviesSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <aside className="w-full lg:block lg:w-80 xl:w-96">
      <h2 className="mb-4 text-xl font-bold">More Like This</h2>
      <div className="grid grid-cols-2 gap-2">
        {movies.slice(0, 6).map((item) => (
          <SimilarMovieCard key={item.id} movie={item} />
        ))}
      </div>
    </aside>
  );
}

function SimilarMovieCard({ movie }: { movie: Media }) {
  return (
    <a
      href={`/movie/${movie.id}`}
      className="group border-border hover:border-primary/50 relative overflow-hidden rounded-lg border transition-colors"
    >
      <div className="bg-muted relative aspect-video overflow-hidden">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={movie.title || movie.name || ''}
            fill
            sizes="(max-width: 1024px) 100vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <span className="text-xs">No Image</span>
          </div>
        )}
        {movie.vote_average > 0 && (
          <div className="bg-background/90 absolute top-2 right-2 flex items-center gap-1 rounded-md px-2 py-1 backdrop-blur-sm">
            <Star className="fill-primary text-primary h-3 w-3" />
            <span className="text-foreground text-xs font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold">{movie.title || movie.name}</p>
      </div>
    </a>
  );
}
