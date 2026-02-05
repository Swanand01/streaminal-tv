'use client';
// Movie detail page

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { getMovieDetails, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Clock, User } from 'lucide-react';

export default function MoviePage() {
    const params = useParams();
    const movieId = parseInt(params.id as string);

    // Fetch movie details
    const { data: movie, isLoading } = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => getMovieDetails(movieId),
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
                <div className="relative aspect-video w-full">
                    <iframe
                        src={videoUrl}
                        className="h-full w-full"
                        allowFullScreen
                        allow="autoplay; fullscreen"
                    />
                </div>
            </div>

            {/* Movie Info */}
            <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
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
                        <p className="mt-4 max-w-4xl text-pretty leading-relaxed text-foreground/90">
                            {movie.overview}
                        </p>
                    )}
                </div>

                {/* Cast Section */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Cast</h2>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {movie.credits.cast.slice(0, 12).map((actor) => (
                                <Link
                                    key={actor.id}
                                    href={`/person/${actor.id}`}
                                    className="group flex flex-col gap-2 rounded-lg border border-border p-3 transition-all hover:border-primary/50 hover:bg-muted/50"
                                >
                                    <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
                                        {actor.profile_path ? (
                                            <img
                                                src={getImageUrl(actor.profile_path, 'w500')}
                                                alt={actor.name}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                <User className="h-12 w-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold leading-tight group-hover:text-primary">
                                            {actor.name}
                                        </p>
                                        <p className="line-clamp-2 text-xs text-muted-foreground">
                                            {actor.character}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
