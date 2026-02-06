import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { SearchResultsSkeleton } from '@/components/skeletons/search-results-skeleton';
import { SearchResults } from './search-results';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="bg-background min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-20 md:px-8 lg:px-12">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}
