import { getMovieDetails, getSimilarMovies, getMovieVideos, getMovieReviews } from '@/lib/tmdb';
import { MoviePlayer } from '@/components/movie-player';
import { MovieHeader } from './movie-header';
import { MovieTabs } from './movie-tabs';
import { SimilarMoviesSection } from './similar-movies-section';

interface MovieContentProps {
  movieId: number;
}

export async function MovieContent({ movieId }: MovieContentProps) {
  // Fetch all data in parallel on the server
  const [movie, similarMovies, videos, reviews] = await Promise.all([
    getMovieDetails(movieId).catch(() => null),
    getSimilarMovies(movieId).catch(() => []),
    getMovieVideos(movieId).catch(() => []),
    getMovieReviews(movieId).catch(() => []),
  ]);

  if (!movie) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  return (
    <>
      {/* Video Player Section */}
      <div className="relative w-full pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <MoviePlayer movieId={movieId} />
        </div>
      </div>

      {/* Movie Info with Sidebar Layout */}
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <MovieHeader movie={movie} />
            <MovieTabs movie={movie} videos={videos} reviews={reviews} />
          </div>

          {/* Recommendations Sidebar */}
          <SimilarMoviesSection movies={similarMovies} />
        </div>
      </div>
    </>
  );
}
