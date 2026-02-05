import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MediaGrid } from '@/components/media-grid';
import { searchMedia } from '@/lib/tmdb';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Enter a search term to find movies and TV shows
        </p>
      </div>
    );
  }

  const results = await searchMedia(query);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      <MediaGrid
        items={results}
        emptyMessage={`No results found for "${query}". Try a different search term.`}
      />
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-[1920px] px-4 pb-20 pt-24 md:px-8 lg:px-12">
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}
