'use client';
// TV show detail page

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { CastList } from '@/components/cast-list';
import { MediaCarousel } from '@/components/media-carousel';
import { getTVDetails, getTVSeason, getSimilarTVShows, getTVVideos, getTVReviews, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Tv, Play, User2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function TVShowPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tvId = parseInt(params.id as string);
    
    // Initialize from URL params or defaults
    const seasonParam = searchParams.get('season');
    const episodeParam = searchParams.get('episode');
    
    const [selectedSeason, setSelectedSeason] = useState(
        seasonParam ? parseInt(seasonParam) : 1
    );
    const [selectedEpisode, setSelectedEpisode] = useState(
        episodeParam ? parseInt(episodeParam) : 1
    );
    const [episodesShown, setEpisodesShown] = useState(12);
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    // Update URL when season or episode changes (but not on initial mount if URL already has the right values)
    useEffect(() => {
        const currentSeason = searchParams.get('season');
        const currentEpisode = searchParams.get('episode');
        
        // Only update if values actually changed
        if (currentSeason !== selectedSeason.toString() || currentEpisode !== selectedEpisode.toString()) {
            const newParams = new URLSearchParams();
            newParams.set('season', selectedSeason.toString());
            newParams.set('episode', selectedEpisode.toString());
            router.replace(`/tv/${tvId}?${newParams.toString()}`, { scroll: false });
        }
    }, [selectedSeason, selectedEpisode, tvId, router, searchParams]);

    // Check for invalid ID
    if (isNaN(tvId)) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Invalid TV show ID</p>
                    <p className="text-sm text-muted-foreground">Please check the URL and try again</p>
                </div>
            </div>
        );
    }

    // Fetch TV show details
    const { data: show, isLoading: showLoading, error: showError } = useQuery({
        queryKey: ['tv', tvId],
        queryFn: () => getTVDetails(tvId),
    });

    // Fetch season data
    const { data: seasonData, isLoading: seasonLoading } = useQuery({
        queryKey: ['tv', tvId, 'season', selectedSeason],
        queryFn: () => getTVSeason(tvId, selectedSeason),
        enabled: !!show,
    });

    // Fetch similar TV shows
    const { data: similarShows } = useQuery({
        queryKey: ['tv', tvId, 'similar'],
        queryFn: () => getSimilarTVShows(tvId),
        enabled: !!show,
    });

    // Fetch videos (trailers, teasers, clips)
    const { data: videos } = useQuery({
        queryKey: ['tv', tvId, 'videos'],
        queryFn: () => getTVVideos(tvId),
        enabled: !!show,
    });

    // Fetch reviews
    const { data: reviews } = useQuery({
        queryKey: ['tv', tvId, 'reviews'],
        queryFn: () => getTVReviews(tvId),
        enabled: !!show,
    });

    const handleEpisodeClick = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);
    };

    const handleSeasonChange = (value: string) => {
        const season = parseInt(value);
        setSelectedSeason(season);
        setSelectedEpisode(1); // Reset to first episode when changing seasons
        setEpisodesShown(12); // Reset pagination
    };

    if (showLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            </div>
        );
    }

    if (showError) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
                    <p className="text-xl text-muted-foreground">Failed to load TV show</p>
                    <p className="text-sm text-muted-foreground">The TV show could not be found or there was an error loading it</p>
                </div>
            </div>
        );
    }

    if (!show) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] items-center justify-center">
                    <p className="text-muted-foreground">TV show not found</p>
                </div>
            </div>
        );
    }

    const title = show.name || 'Untitled';
    const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;

    const videoUrl = `https://vidsrc-embed.ru/embed/tv?tmdb=${tvId}&season=${selectedSeason}&episode=${selectedEpisode}`;

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

            {/* Show Info with Sidebar Layout */}
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
                                {show.vote_average > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-primary text-primary" />
                                        <span className="font-medium text-foreground">{show.vote_average.toFixed(1)}</span>
                                    </div>
                                )}
                                {show.status && (
                                    <div className="flex items-center gap-1">
                                        <Tv className="h-4 w-4" />
                                        <span>{show.status}</span>
                                    </div>
                                )}
                                {show.number_of_seasons && (
                                    <span>{show.number_of_seasons} {show.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                                )}
                            </div>

                            {show.genres && show.genres.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {show.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {seasonData?.episodes.find(ep => ep.episode_number === selectedEpisode)?.overview ? (
                                <p className="mt-4 text-pretty leading-relaxed text-foreground/90">
                                    {seasonData.episodes.find(ep => ep.episode_number === selectedEpisode)?.overview}
                                </p>
                            ) : show.overview && (
                                <p className="mt-4 text-pretty leading-relaxed text-foreground/90">
                                    {show.overview}
                                </p>
                            )}
                        </div>

                        {/* Tabs Navigation */}
                        <Tabs defaultValue="episodes" className="mt-8">
                            <TabsList className="overflow-x-auto">
                                <TabsTrigger value="episodes">Episodes</TabsTrigger>
                                <TabsTrigger value="cast">Cast</TabsTrigger>
                                {videos && videos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
                                {reviews && reviews.length > 0 && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
                            </TabsList>

                            {/* Episodes Tab */}
                            <TabsContent value="episodes" className="mt-6">
                                <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Episodes</h2>
                                <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1).map((season) => (
                                            <SelectItem key={season} value={season.toString()}>
                                                Season {season}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {seasonLoading ? (
                                <div className="flex min-h-[200px] items-center justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                </div>
                            ) : seasonData && seasonData.episodes ? (
                                <>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 items-start">
                                        {seasonData.episodes.slice(0, episodesShown).map((episode) => (
                                            <button
                                                key={episode.id}
                                                onClick={() => handleEpisodeClick(episode.episode_number)}
                                                className={`group relative overflow-hidden rounded-lg border transition-all text-left ${selectedEpisode === episode.episode_number
                                                        ? 'border-primary ring-2 ring-primary'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="relative aspect-video overflow-hidden bg-muted">
                                                    {episode.still_path ? (
                                                        <img
                                                            src={getImageUrl(episode.still_path, 'w500')}
                                                            alt={episode.name}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                                            <Tv className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                    {episode.vote_average > 0 && (
                                                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 backdrop-blur-sm">
                                                            <Star className="h-3 w-3 fill-primary text-primary" />
                                                            <span className="text-xs font-semibold text-foreground">
                                                                {episode.vote_average.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-semibold">
                                                        {episode.episode_number}. {episode.name}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {seasonData.episodes.length > episodesShown && (
                                        <div className="mt-6 flex justify-center">
                                            <Button
                                                variant="outline"
                                                onClick={() => setEpisodesShown(prev => prev + 12)}
                                            >
                                                Load More Episodes ({seasonData.episodes.length - episodesShown} remaining)
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-muted-foreground">No episodes available</p>
                            )}
                                </div>
                            </TabsContent>

                            {/* Cast Tab */}
                            <TabsContent value="cast" className="mt-6">
                                {show.credits?.cast && <CastList cast={show.credits.cast} limit={20} />}
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
                        {similarShows && similarShows.length > 0 && (
                            <div className="mt-12 space-y-4 lg:hidden">
                                <h2 className="text-2xl font-bold">More Like This</h2>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {similarShows.slice(0, 6).map((item) => (
                                        <a
                                            key={item.id}
                                            href={`/tv/${item.id}`}
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
                    {similarShows && similarShows.length > 0 && (
                        <aside className="hidden w-full lg:block lg:w-80 xl:w-96">
                            <h2 className="mb-4 text-xl font-bold">More Like This</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {similarShows.slice(0, 6).map((item) => (
                                    <a
                                        key={item.id}
                                        href={`/tv/${item.id}`}
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
