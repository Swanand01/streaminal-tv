'use client';
// TV Shows page - v1

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { MediaGrid } from '@/components/media-grid';
import { Pagination } from '@/components/pagination';
import { discoverTVShows, getTVGenres, Genre } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TVShowsPage() {
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch genres
    const { data: genres = [] } = useQuery({
        queryKey: ['tvGenres'],
        queryFn: getTVGenres,
    });

    // Fetch TV shows with TanStack Query
    const { data: tvShowsData, isLoading } = useQuery({
        queryKey: ['tvShows', selectedGenres, minRating, sortBy, currentPage],
        queryFn: async () => {
            const params: any = {
                page: currentPage,
                sort_by: sortBy,
            };

            if (selectedGenres.length > 0) {
                params.with_genres = selectedGenres.join(',');
            }

            if (minRating > 0) {
                params['vote_average.gte'] = minRating;
            }

            return discoverTVShows(params);
        },
    });

    const tvShows = tvShowsData?.results || [];
    const totalPages = Math.min(tvShowsData?.total_pages || 1, 500);
    const totalResults = tvShowsData?.total_results || 0;

    const handleGenreToggle = (genreId: number) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId)
                ? prev.filter((id) => id !== genreId)
                : [...prev, genreId]
        );
        setCurrentPage(1);
    };

    const handleRatingChange = (rating: number) => {
        setMinRating(rating);
        setCurrentPage(1);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <div className="container mx-auto px-4 pb-8 pt-24 md:px-8 lg:px-12">
                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden w-64 flex-shrink-0 lg:block">
                        <div className="sticky top-24">
                            <FiltersSidebar
                                genres={genres}
                                selectedGenres={selectedGenres}
                                minRating={minRating}
                                onGenreToggle={handleGenreToggle}
                                onRatingChange={handleRatingChange}
                            />
                        </div>
                    </aside>

                    {/* Mobile Filters Overlay */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-50 overflow-y-auto bg-background p-6 lg:hidden">
                            <FiltersSidebar
                                genres={genres}
                                selectedGenres={selectedGenres}
                                minRating={minRating}
                                onGenreToggle={handleGenreToggle}
                                onRatingChange={handleRatingChange}
                                onClose={() => setShowMobileFilters(false)}
                                showCloseButton
                            />
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="min-w-0 flex-1">
                        <div className="mb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-balance">TV Shows</h1>
                                    {!isLoading && (
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {totalResults.toLocaleString()} TV shows found
                                        </p>
                                    )}
                                </div>

                                {/* Desktop Controls */}
                                <div className="hidden items-center gap-3 lg:flex">
                                    {/* Sort Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="default" className="min-w-[140px]">
                                                {sortBy === 'popularity.desc' && 'Popular'}
                                                {sortBy === 'vote_average.desc' && 'Top Rated'}
                                                {sortBy === 'first_air_date.desc' && 'Latest'}
                                                {sortBy === 'first_air_date.asc' && 'Oldest'}
                                                <ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[140px]">
                                            <DropdownMenuItem onClick={() => handleSortChange('popularity.desc')}>
                                                Popular
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSortChange('vote_average.desc')}>
                                                Top Rated
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSortChange('first_air_date.desc')}>
                                                Latest
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleSortChange('first_air_date.asc')}>
                                                Oldest
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Mobile Controls */}
                            <div className="mt-4 flex items-center gap-3 lg:hidden">
                                {/* Sort Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="secondary" size="default" className="flex-1">
                                            {sortBy === 'popularity.desc' && 'Popular'}
                                            {sortBy === 'vote_average.desc' && 'Top Rated'}
                                            {sortBy === 'first_air_date.desc' && 'Latest'}
                                            {sortBy === 'first_air_date.asc' && 'Oldest'}
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[140px]">
                                        <DropdownMenuItem onClick={() => handleSortChange('popularity.desc')}>
                                            Popular
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSortChange('vote_average.desc')}>
                                            Top Rated
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSortChange('first_air_date.desc')}>
                                            Latest
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSortChange('first_air_date.asc')}>
                                            Oldest
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Mobile Filters Button */}
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => setShowMobileFilters(true)}
                                    className="flex-1"
                                >
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    Filters
                                </Button>
                            </div>
                        </div>

                        {isLoading || tvShows.length === 0 ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                {isLoading ? (
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                ) : (
                                    <p className="text-muted-foreground">No TV shows found with the selected filters</p>
                                )}
                            </div>
                        ) : (
                            <>
                                <MediaGrid items={tvShows} emptyMessage="No TV shows found with the selected filters" />

                                {totalPages > 1 && (
                                    <div className="mt-12">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
