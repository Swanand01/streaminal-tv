'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FiltersSidebar } from '@/components/filters-sidebar';
import { MediaGrid } from '@/components/media/media-grid';
import { Pagination } from '@/components/pagination';
import { discoverMovies, discoverTVShows, DiscoverParams, Genre, Media } from '@/lib/tmdb';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrowseContentProps {
  mediaType: 'movie' | 'tv';
  title: string;
  initialGenres: Genre[];
  initialData: {
    results: Media[];
    total_pages: number;
    total_results: number;
  };
  lockedParams?: Pick<
    DiscoverParams,
    'with_original_language' | 'with_keywords' | 'with_genres' | 'without_keywords'
  >;
  itemLabel?: string;
}

function parseGenres(param: string | null): number[] {
  if (!param) return [];
  return param
    .split(',')
    .map((id) => Number(id))
    .filter((id) => !Number.isNaN(id));
}

export function BrowseContent({
  mediaType,
  title,
  initialGenres,
  initialData,
  lockedParams,
  itemLabel: itemLabelProp,
}: BrowseContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const selectedGenres = parseGenres(searchParams.get('genres'));
  const minRating = Number(searchParams.get('rating')) || 0;
  const sortBy = searchParams.get('sort') || 'popularity.desc';
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null) params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }

  const isMovie = mediaType === 'movie';
  const queryKey = isMovie ? 'movies' : 'tvShows';
  const releaseDateField = isMovie ? 'primary_release_date' : 'first_air_date';
  const itemLabel = itemLabelProp ?? (isMovie ? 'movies' : 'TV shows');

  const lockedGenreIds = lockedParams?.with_genres?.split(',').map(Number) ?? [];
  const displayGenres = initialGenres.filter((g) => !lockedGenreIds.includes(g.id));

  // Fetch media with TanStack Query
  const { data: mediaData, isLoading } = useQuery({
    queryKey: [queryKey, selectedGenres, minRating, sortBy, currentPage, lockedParams],
    queryFn: async () => {
      const params: DiscoverParams = {
        page: currentPage,
        sort_by: sortBy,
      };

      if (isMovie) {
        const today = new Date().toISOString().split('T')[0];
        params['release_date.lte'] = today;
      }

      const allGenreIds = [...lockedGenreIds, ...selectedGenres];
      if (allGenreIds.length > 0) params.with_genres = allGenreIds.join(',');

      if (lockedParams?.with_original_language)
        params.with_original_language = lockedParams.with_original_language;
      if (lockedParams?.with_keywords) params.with_keywords = lockedParams.with_keywords;
      if (lockedParams?.without_keywords) params.without_keywords = lockedParams.without_keywords;

      if (minRating > 0) {
        params['vote_average.gte'] = minRating;
      }

      if (sortBy === 'vote_average.desc') {
        params['vote_count.gte'] = 200;
        params.without_genres = '99,10755';
      }

      return isMovie ? discoverMovies(params) : discoverTVShows(params);
    },
    initialData:
      currentPage === 1 &&
      selectedGenres.length === 0 &&
      minRating === 0 &&
      sortBy === 'popularity.desc'
        ? initialData
        : undefined,
  });

  const items = mediaData?.results || [];
  const totalPages = Math.min(mediaData?.total_pages || 1, 500);
  const totalResults = mediaData?.total_results || 0;

  const handleGenreToggle = (genreId: number) => {
    const next = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];
    updateParams({ genres: next.length > 0 ? next.join(',') : null, page: null });
  };

  const handleRatingChange = (rating: number) => {
    updateParams({ rating: rating > 0 ? String(rating) : null, page: null });
  };

  const handleSortChange = (sort: string) => {
    updateParams({ sort: sort !== 'popularity.desc' ? sort : null, page: null });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: page > 1 ? String(page) : null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 pt-24 md:px-8 lg:px-12">
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <FiltersSidebar
              genres={displayGenres}
              selectedGenres={selectedGenres}
              minRating={minRating}
              onGenreToggle={handleGenreToggle}
              onRatingChange={handleRatingChange}
            />
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="bg-background fixed inset-0 z-50 overflow-y-auto p-6 lg:hidden">
            <FiltersSidebar
              genres={displayGenres}
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
        <main className="min-w-0 flex-1 pb-4">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="w-full sm:w-auto sm:flex-1">
              <h1 className="text-3xl font-bold text-balance">{title}</h1>
              {!isLoading && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {totalResults.toLocaleString('en-US')} {itemLabel} found
                </p>
              )}
            </div>

            <div className="flex shrink-0 gap-3">
              {/* Sort Select */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger size="lg" className="min-w-35">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity.desc">Popular</SelectItem>
                  <SelectItem value="vote_average.desc">Top Rated</SelectItem>
                  <SelectItem value={`${releaseDateField}.desc`}>Latest</SelectItem>
                  <SelectItem value={`${releaseDateField}.asc`}>Oldest</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {isLoading || items.length === 0 ? (
            <div className="flex min-h-100 items-center justify-center">
              {isLoading ? (
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
              ) : (
                <p className="text-muted-foreground">
                  No {itemLabel} found with the selected filters
                </p>
              )}
            </div>
          ) : (
            <>
              <MediaGrid
                items={items}
                emptyMessage={`No ${itemLabel} found with the selected filters`}
                showMediaType={false}
              />

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
  );
}
