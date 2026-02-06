'use client';
// Movie detail page

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { CastList } from '@/components/cast-list';
import { MediaCarousel } from '@/components/media-carousel';
import { getMovieDetails, getSimilarMovies, getMovieVideos, getMovieReviews } from '@/lib/tmdb';
import { Star, Calendar, Clock, Play, User2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

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

    // Fetch videos (trailers, teasers, clips)
    const { data: videos } = useQuery({
        queryKey: ['movie', movieId, 'videos'],
        queryFn: () => getMovieVideos(movieId),
        enabled: !!movie,
    });

    // Fetch reviews
    const { data: reviews } = useQuery({
        queryKey: ['movie', movieId, 'reviews'],
        queryFn: () => getMovieReviews(movieId),
        enabled: !!movie,
    });

    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

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

                        {/* Tabs Navigation */}
                        <Tabs defaultValue="cast" className="mt-8">
                            <TabsList className="overflow-x-auto">
                                <TabsTrigger value="cast">Cast</TabsTrigger>
                                {videos && videos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
                                {reviews && reviews.length > 0 && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                            </TabsList>

                            {/* Cast Tab */}
                            <TabsContent value="cast" className="mt-6">
                                {movie.credits?.cast && <CastList cast={movie.credits.cast} limit={20} />}
                            </TabsContent>

                            {/* Videos Tab */}
                            <TabsContent value="videos" className="mt-6">
                                {videos && videos.length > 0 && (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {videos.filter(video => video.site === 'YouTube').slice(0, 12).map((video) => (
                                            <div
                                                key={video.id}
                                                className="overflow-hidden rounded-lg border border-border"
                                            >
                                                <div className="relative aspect-video overflow-hidden bg-muted">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${video.key}`}
                                                        title={video.name}
                                                        className="h-full w-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                    <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                                        {video.type}
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="line-clamp-2 text-sm font-semibold leading-tight">
                                                        {video.name}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews" className="mt-6">
                                {reviews && reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {reviews.map((review) => {
                                            const isExpanded = expandedReviews.has(review.id);
                                            const shouldTruncate = review.content.length > 600;

                                            return (
                                                <div key={review.id} className="rounded-lg border border-border p-4">
                                                    <div className="mb-3 flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                                {review.author_details.avatar_path ? (
                                                                    <img
                                                                        src={
                                                                            review.author_details.avatar_path.startsWith('/https')
                                                                                ? review.author_details.avatar_path.slice(1)
                                                                                : `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`
                                                                        }
                                                                        alt={review.author}
                                                                        className="h-full w-full rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <User2 className="h-5 w-5 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">{review.author}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {review.author_details.rating && (
                                                            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                                <span className="text-sm font-semibold">
                                                                    {review.author_details.rating}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm leading-relaxed text-foreground/90">
                                                        <p className={!isExpanded && shouldTruncate ? 'line-clamp-6' : ''}>
                                                            {review.content}
                                                        </p>
                                                        {shouldTruncate && (
                                                            <button
                                                                onClick={() => {
                                                                    setExpandedReviews((prev) => {
                                                                        const next = new Set(prev);
                                                                        if (isExpanded) {
                                                                            next.delete(review.id);
                                                                        } else {
                                                                            next.add(review.id);
                                                                        }
                                                                        return next;
                                                                    });
                                                                }}
                                                                className="mt-2 text-sm font-medium text-primary hover:underline"
                                                            >
                                                                {isExpanded ? 'Show less' : 'Read more'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">No reviews available</p>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* More Like This - Mobile */}
                        {similarMovies && similarMovies.length > 0 && (
                            <div className="mt-12 space-y-4 lg:hidden">
                                <h2 className="text-2xl font-bold">More Like This</h2>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                            </div>
                        )}
                    </div>

                    {/* Recommendations Sidebar - Desktop */}
                    {similarMovies && similarMovies.length > 0 && (
                        <aside className="hidden w-full lg:block lg:w-80 xl:w-96">
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
