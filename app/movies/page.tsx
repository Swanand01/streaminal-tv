'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { MediaGrid } from '@/components/media-grid';
import { Pagination } from '@/components/pagination';
import { discoverMovies, getMovieGenres, Genre } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MoviesPage() {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch genres
  const { data: genres = [] } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: getMovieGenres,
  });

  // Fetch movies with TanStack Query
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ['movies', selectedGenres, minRating, sortBy, currentPage],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const params: any = {
        page: currentPage,
        sort_by: sortBy,
        'release_date.lte': today,
      };
      
      if (selectedGenres.length > 0) {
        params.with_genres = selectedGenres.join(',');
      }
      
      if (minRating > 0) {
        params['vote_average.gte'] = minRating;
      }
      
      return discoverMovies(params);
    },
  });

  const movies = moviesData?.results || [];
  const totalPages = Math.min(moviesData?.total_pages || 1, 500);
  const totalResults = moviesData?.total_results || 0;

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1); // Reset to page 1 when filters change
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
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-balance">Movies</h1>
                {!isLoading && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {totalResults.toLocaleString()} movies found
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="default" className="min-w-[140px]">
                      {sortBy === 'popularity.desc' && 'Popular'}
                      {sortBy === 'vote_average.desc' && 'Top Rated'}
                      {sortBy === 'primary_release_date.desc' && 'Latest'}
                      {sortBy === 'primary_release_date.asc' && 'Oldest'}
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
                    <DropdownMenuItem onClick={() => handleSortChange('primary_release_date.desc')}>
                      Latest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSortChange('primary_release_date.asc')}>
                      Oldest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Mobile Filters Button */}
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {isLoading || movies.length === 0 ? (
              <div className="flex min-h-[400px] items-center justify-center">
                {isLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                ) : (
                  <p className="text-muted-foreground">No movies found with the selected filters</p>
                )}
              </div>
            ) : (
              <>
                <MediaGrid items={movies} emptyMessage="No movies found with the selected filters" />
                
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
