'use client';
// Person/Actor detail page

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { getPersonDetails, getImageUrl } from '@/lib/tmdb';
import { MediaGrid } from '@/components/media-grid';
import { Calendar, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Media } from '@/lib/tmdb';

export default function PersonPage() {
    const params = useParams();
    const personId = parseInt(params.id as string);
    const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
    const [itemsShown, setItemsShown] = useState(20);

    // Fetch person details
    const { data: person, isLoading } = useQuery({
        queryKey: ['person', personId],
        queryFn: () => getPersonDetails(personId),
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

    if (!person) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex min-h-[80vh] items-center justify-center">
                    <p className="text-muted-foreground">Person not found</p>
                </div>
            </div>
        );
    }

    // Combine and sort credits by popularity/vote_average
    const movieCredits = person.movie_credits?.cast || [];
    const tvCredits = person.tv_credits?.cast || [];

    // Add media_type to each credit
    const moviesWithType = movieCredits.map(credit => ({ ...credit, media_type: 'movie' as const }));
    const tvWithType = tvCredits.map(credit => ({ ...credit, media_type: 'tv' as const }));

    // Sort by vote_average and popularity
    const sortedMovies = [...moviesWithType].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    const sortedTV = [...tvWithType].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

    const activeCredits = activeTab === 'movies' ? sortedMovies : sortedTV;
    const displayedCredits = activeCredits.slice(0, itemsShown);

    const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : null;
    const age = person.birthday ? new Date().getFullYear() - new Date(person.birthday).getFullYear() : null;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-4 py-24 md:px-8 lg:px-12">
                {/* Person Header */}
                <div className="mb-12 flex flex-col gap-8 md:flex-row">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <div className="relative h-80 w-64 overflow-hidden rounded-lg bg-muted md:h-96 md:w-72">
                            {person.profile_path ? (
                                <img
                                    src={getImageUrl(person.profile_path, 'w500')}
                                    alt={person.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <User className="h-24 w-24" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Person Info */}
                    <div className="flex-1">
                        <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">{person.name}</h1>

                        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {person.known_for_department && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-foreground">{person.known_for_department}</span>
                                </div>
                            )}
                            {person.birthday && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(person.birthday).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                        {age && ` (${age} years old)`}
                                    </span>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{person.place_of_birth}</span>
                                </div>
                            )}
                        </div>

                        {person.biography && (
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">Biography</h2>
                                <p className="max-w-4xl text-pretty leading-relaxed text-foreground/90">
                                    {person.biography}
                                </p>
                            </div>
                        )}

                        {person.also_known_as && person.also_known_as.length > 0 && (
                            <div className="mt-6">
                                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Also Known As</h3>
                                <div className="flex flex-wrap gap-2">
                                    {person.also_known_as.slice(0, 5).map((name, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                        >
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Filmography Section */}
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
                            <MediaGrid media={displayedCredits as Media[]} />

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
            </div>
        </div>
    );
}
