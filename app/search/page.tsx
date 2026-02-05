import { Suspense } from 'react';
import { Navigation } from '@/components/navigation';
import { MediaGrid } from '@/components/media-grid';
import { PersonCard } from '@/components/person-card';
import { searchAll, type Media, type Person } from '@/lib/tmdb';
import { Loader2 } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Enter a search term to find movies, TV shows, and people
        </p>
      </div>
    );
  }

  const results = await searchAll(query);

  // Separate results by type
  const media = results.filter((item): item is Media => 
    item.media_type === 'movie' || item.media_type === 'tv'
  );
  const people = results.filter((item): item is Person => 
    item.media_type === 'person'
  );

  const totalResults = results.length;

  if (totalResults === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Search Results for &quot;{query}&quot;
          </h1>
          <p className="text-muted-foreground">No results found</p>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-muted-foreground">
            No results found for &quot;{query}&quot;. Try a different search term.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* People Results */}
      {people.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            People ({people.length})
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5">
            {people.slice(0, 10).map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>
      )}

      {/* Media Results */}
      {media.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Movies & TV Shows ({media.length})
          </h2>
          <MediaGrid items={media} />
        </div>
      )}
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
