import { MediaGrid } from '@/components/media-grid';
import { PersonCard } from '@/components/person-card';
import { searchAll, type Media, type Person } from '@/lib/tmdb';

interface SearchResultsProps {
    query: string;
}

export async function SearchResults({ query }: SearchResultsProps) {
    if (!query) {
        return (
            <div className="flex min-h-100 items-center justify-center">
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
                <div className="flex min-h-100 items-center justify-center">
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
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {people.slice(0, 12).map((person) => (
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
