'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CastList } from '@/components/cast-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, User2, Tv } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import type { MediaDetails, Season, Video, Review } from '@/lib/tmdb';

interface TVShowTabsProps {
    show: MediaDetails;
    initialSeason: number;
    initialEpisode: number;
    seasonData: Season;
    videos?: Video[];
    reviews?: Review[];
    onSeasonChange: (season: number) => void;
    onEpisodeChange: (episode: number) => void;
}

export function TVShowTabs({
    show,
    initialSeason,
    initialEpisode,
    seasonData,
    videos,
    reviews,
    onSeasonChange,
    onEpisodeChange,
}: TVShowTabsProps) {
    const [episodesShown, setEpisodesShown] = useState(12);
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);

    const handleSeasonChange = (value: string) => {
        const season = parseInt(value);
        setSelectedSeason(season);
        setSelectedEpisode(1);
        setEpisodesShown(12);
        onSeasonChange(season);
    };

    const handleEpisodeClick = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);
        onEpisodeChange(episodeNumber);
    };

    return (
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
                        <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
                            <SelectTrigger className="w-45">
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

                    {seasonData && seasonData.episodes ? (
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
                                                <Image
                                                    src={getImageUrl(episode.still_path, 'w500')}
                                                    alt={episode.name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                                    <Tv className="h-8 w-8" />
                                                </div>
                                            )}
                                            {episode.vote_average && episode.vote_average > 0 && (
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
                                                    <Image
                                                        src={
                                                            review.author_details.avatar_path.startsWith('/https')
                                                                ? review.author_details.avatar_path.slice(1)
                                                                : `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`
                                                        }
                                                        alt={review.author}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
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
    );
}
