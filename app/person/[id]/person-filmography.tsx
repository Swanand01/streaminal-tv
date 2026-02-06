'use client';

import { useState } from 'react';
import { MediaGrid } from '@/components/media-grid';
import { Button } from '@/components/ui/button';
import type { PersonDetails, Media } from '@/lib/tmdb';

interface PersonFilmographyProps {
    person: PersonDetails;
}

export function PersonFilmography({ person }: PersonFilmographyProps) {
    const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
    const [itemsShown, setItemsShown] = useState(20);

    // Combine and sort credits by vote_average
    const movieCredits = person.movie_credits?.cast || [];
    const tvCredits = person.tv_credits?.cast || [];

    // Add media_type to each credit
    const moviesWithType = movieCredits.map(credit => ({ ...credit, media_type: 'movie' as const }));
    const tvWithType = tvCredits.map(credit => ({ ...credit, media_type: 'tv' as const }));

    // Sort by vote_average
    const sortedMovies = [...moviesWithType].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    const sortedTV = [...tvWithType].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

    const activeCredits = activeTab === 'movies' ? sortedMovies : sortedTV;
    const displayedCredits = activeCredits.slice(0, itemsShown);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Filmography</h2>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'movies' ? 'default' : 'outline'}
                        onClick={() => {
                            setActiveTab('movies');
                            setItemsShown(20);
                        }}
                    >
                        Movies ({movieCredits.length})
                    </Button>
                    <Button
                        variant={activeTab === 'tv' ? 'default' : 'outline'}
                        onClick={() => {
                            setActiveTab('tv');
                            setItemsShown(20);
                        }}
                    >
                        TV Shows ({tvCredits.length})
                    </Button>
                </div>
            </div>

            {activeCredits.length > 0 ? (
                <>
                    <MediaGrid items={displayedCredits as Media[]} />

                    {activeCredits.length > itemsShown && (
                        <div className="mt-8 flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setItemsShown(prev => prev + 20)}
                            >
                                Load More ({activeCredits.length - itemsShown} remaining)
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-muted-foreground">
                    No {activeTab === 'movies' ? 'movies' : 'TV shows'} found
                </p>
            )}
        </div>
    );
}
