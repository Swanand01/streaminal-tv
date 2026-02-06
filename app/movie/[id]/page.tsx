'use client';
// Movie detail page

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { CastList } from '@/components/cast-list';
import { MediaCarousel } from '@/components/media-carousel';
import { getMovieDetails, getSimilarMovies } from '@/lib/tmdb';
import { Star, Calendar, Clock } from 'lucide-react';

export default function MoviePage() {
    const params = useParams();
    const movieId = parseInt(params.id as string);

    // Check for invalid ID
    if (isNaN(movieId)) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Invalid movie ID</p>
                    <p className="text-sm text-muted-foreground">Please check the URL and try again</p>
                </div>
            </div>
        );
    }

    // Fetch movie details
    const { data: movie, isLoading, error } = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => getMovieDetails(movieId),
    });

    // Fetch similar movies
    const { data: similarMovies } = useQuery({
        queryKey: ['movie', movieId, 'similar'],
        queryFn: () => getSimilarMovies(movieId),
        enabled: !!movie,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Failed to load movie</p>
                    <p className="text-sm text-muted-foreground">The movie could not be found or there was an error loading it</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] items-center justify-center">
                    <p className="text-muted-foreground">Movie not found</p>
                </div>
            </div>
        );
    }

    const title = movie.title || 'Untitled';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
    const videoUrl = `https://vidsrc-embed.ru/embed/movie?tmdb=${movieId}`;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Video Player Section */}
            <div className="relative w-full bg-black pt-20">
                <div className="container mx-auto px-4 md:px-8 lg:px-12">
                    <div className="relative aspect-video w-full">
                        <iframe
                            src={videoUrl}
                            className="h-full w-full"
                            allowFullScreen
                            allow="autoplay; fullscreen"
                        />
                    </div>
                </div>
            </div>

            {/* Movie Info with Sidebar Layout */}
            <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Main Content */}
                    <div className="min-w-0 flex-1">
                        <div className="mb-8">
                            <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                {year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{year}</span>
                                    </div>
                                )}
                                {movie.vote_average > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="font-medium text-foreground">{movie.vote_average.toFixed(1)}</span>
                                    </div>
                                )}
                                {movie.runtime && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                                    </div>
                                )}
                            </div>

                            {movie.genres && movie.genres.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {movie.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {movie.overview && (
                                <p className="mt-4 text-pretty leading-relaxed text-foreground/90">
                                    {movie.overview}
                                </p>
                            )}
                        </div>

                        {movie.credits?.cast && <CastList cast={movie.credits.cast} limit={20} />}
                    </div>

                    {/* Recommendations Sidebar */}
                    {similarMovies && similarMovies.length > 0 && (
                        <aside className="w-full lg:w-80 xl:w-96">
                            <h2 className="mb-4 text-xl font-bold">More Like This</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {similarMovies.slice(0, 6).map((item) => (
                                    <a
                                        key={item.id}
                                        href={`/movie/${item.id}`}
                                        className="group relative overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/50"
                                    >
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            {item.backdrop_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`}
                                                    alt={item.title || item.name || ''}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            )}
                                            {item.vote_average > 0 && (
                                                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 backdrop-blur-sm">
                                                    <Star className="h-3 w-3 fill-primary text-primary" />
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {item.vote_average.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <p className="line-clamp-2 text-sm font-semibold">
                                                {item.title || item.name}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
