'use client';
// TV show detail page

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { CastList } from '@/components/cast-list';
import { getTVDetails, getTVSeason, getImageUrl } from '@/lib/tmdb';
import { Star, Calendar, Tv } from 'lucide-react';
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
    const tvId = parseInt(params.id as string);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [episodesShown, setEpisodesShown] = useState(24);

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

    const handleEpisodeClick = (episodeNumber: number) => {
        setSelectedEpisode(episodeNumber);
    };

    const handleSeasonChange = (value: string) => {
        const season = parseInt(value);
        setSelectedSeason(season);
        setSelectedEpisode(1); // Reset to first episode when changing seasons
        setEpisodesShown(24); // Reset pagination
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
                <div className="mx-auto max-w-[1920px]">
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

            {/* Show Info */}
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
                        <p className="mt-4 max-w-4xl text-pretty leading-relaxed text-foreground/90">
                            {seasonData.episodes.find(ep => ep.episode_number === selectedEpisode)?.overview}
                        </p>
                    ) : show.overview && (
                        <p className="mt-4 max-w-4xl text-pretty leading-relaxed text-foreground/90">
                            {show.overview}
                        </p>
                    )}
                </div>

                {/* Cast */}
                {show.credits?.cast && (
                    <div className="mb-8">
                        <CastList cast={show.credits.cast} limit={20} />
                    </div>
                )}

                {/* Episode Selection */}
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {seasonData.episodes.slice(0, episodesShown).map((episode) => (
                                    <button
                                        key={episode.id}
                                        onClick={() => handleEpisodeClick(episode.episode_number)}
                                        className={`group relative overflow-hidden rounded-lg border transition-all ${selectedEpisode === episode.episode_number
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
                                        </div>
                                        <div className="p-3">
                                            <p className="text-sm font-semibold">
                                                {episode.episode_number}. {episode.name}
                                            </p>
                                            {episode.air_date && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {new Date(episode.air_date).toLocaleDateString()}
                                                </p>
                                            )}
                                            {episode.overview && (
                                                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                                                    {episode.overview}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {seasonData.episodes.length > episodesShown && (
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => setEpisodesShown(prev => prev + 24)}
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
            </div>
        </div>
    );
}
