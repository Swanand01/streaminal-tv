import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './use-debounce';
import { searchAll, Media, Person } from '@/lib/tmdb';

export function useSearchSuggestions(query: string) {
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebounce(trimmedQuery, 300);

  const result = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    select: (data) => data.slice(0, 8) as (Media | Person)[],
  });

  const isDebouncing = trimmedQuery.length >= 2 && trimmedQuery !== debouncedQuery;

  return {
    ...result,
    isLoading: result.isLoading || isDebouncing,
  };
}
