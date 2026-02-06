'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TVShowHeader } from './tv-show-header';
import { TVShowTabs } from './tv-show-tabs';
import { SimilarTVShowsSection } from './similar-tv-shows-section';
import type { MediaDetails, Season, Media, Video, Review } from '@/lib/tmdb';

interface TVShowContentProps {
    tvId: number;
    initialShow: MediaDetails;
    initialSeasonData: Season;
    similarShows: Media[];
    videos: Video[];
    reviews: Review[];
    initialSeason: number;
    initialEpisode: number;
}

export function TVShowContent({
    tvId,
    initialShow,
    initialSeasonData,
    similarShows,
    videos,
    reviews,
    initialSeason,
    initialEpisode,
}: TVShowContentProps) {
    const router = useRouter();
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);

    const handleSeasonChange = (season: number) => {
        setSelectedSeason(season);
        setSelectedEpisode(1);
        router.push(`/tv/${tvId}?season=${season}&episode=1`);
    };

    const handleEpisodeChange = (episode: number) => {
        setSelectedEpisode(episode);
        router.push(`/tv/${tvId}?season=${selectedSeason}&episode=${episode}`);
    };

    const videoUrl = `https://vidsrc-embed.ru/embed/tv?tmdb=${tvId}&season=${selectedSeason}&episode=${selectedEpisode}`;
    const episodeOverview = initialSeasonData?.episodes.find(ep => ep.episode_number === selectedEpisode)?.overview;

    return (
        <>
            {/* Video Player Section */}
            <div className="relative w-full pt-20">
                <div className="container mx-auto px-4 md:px-8 lg:px-12">
                    <div className="relative aspect-video w-full">
                        <iframe
                            key={`${selectedSeason}-${selectedEpisode}`}
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
                        <TVShowHeader show={initialShow} episodeOverview={episodeOverview} />
                        <TVShowTabs
                            show={initialShow}
                            initialSeason={selectedSeason}
                            initialEpisode={selectedEpisode}
                            seasonData={initialSeasonData}
                            videos={videos}
                            reviews={reviews}
                            onSeasonChange={handleSeasonChange}
                            onEpisodeChange={handleEpisodeChange}
                        />
                    </div>

                    {/* Recommendations Sidebar */}
                    <SimilarTVShowsSection shows={similarShows} />
                </div>
            </div>
        </>
    );
}
