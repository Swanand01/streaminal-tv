import Image from 'next/image';
import { Media, Person, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, Tv, User } from 'lucide-react';

function isPerson(item: Media | Person): item is Person {
  return item.media_type === 'person';
}

interface SearchSuggestionsProps {
  results: (Media | Person)[] | undefined;
  isLoading: boolean;
  query: string;
  selectedIndex: number;
  onSelect: (item: Media | Person) => void;
  onViewAll: () => void;
}

export function SearchSuggestions({
  results,
  isLoading,
  query,
  selectedIndex,
  onSelect,
  onViewAll,
}: SearchSuggestionsProps) {
  if (query.trim().length < 2) return null;

  return (
    <div className="bg-background/95 border-border absolute top-full right-0 left-0 mt-1 overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm">
      {isLoading ? (
        <div className="space-y-1 p-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-10 w-7 shrink-0 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : results && results.length > 0 ? (
        <div>
          <ul className="p-1">
            {results.map((item, index) => (
              <li key={`${item.media_type}-${item.id}`}>
                <button
                  className={`flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors ${
                    index === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelect(item)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isPerson(item) ? <PersonRow item={item} /> : <MediaRow item={item} />}
                </button>
              </li>
            ))}
          </ul>
          <button
            className={`text-muted-foreground hover:bg-muted/50 w-full border-t px-3 py-2.5 text-center text-sm transition-colors ${
              selectedIndex === results.length ? 'bg-muted' : ''
            }`}
            onClick={onViewAll}
            onMouseDown={(e) => e.preventDefault()}
          >
            View all results for &ldquo;{query.trim()}&rdquo;
          </button>
        </div>
      ) : (
        <div className="text-muted-foreground p-4 text-center text-sm">No results found</div>
      )}
    </div>
  );
}

function MediaRow({ item }: { item: Media }) {
  const title = getTitle(item);
  const year = getReleaseYear(item);
  const mediaType = item.media_type || 'movie';

  return (
    <>
      <div className="bg-muted relative h-10 w-7 shrink-0 overflow-hidden rounded">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path, 'w500')}
            alt={title}
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            {mediaType === 'tv' ? <Tv className="h-3 w-3" /> : <Film className="h-3 w-3" />}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{title}</p>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          {year && <span>{year}</span>}
          <span className="bg-muted-foreground/20 rounded px-1.5 py-0.5 text-[0.625rem] uppercase">
            {mediaType === 'tv' ? 'TV' : 'Movie'}
          </span>
        </div>
      </div>
    </>
  );
}

function PersonRow({ item }: { item: Person }) {
  return (
    <>
      <div className="bg-muted relative h-10 w-7 shrink-0 overflow-hidden rounded">
        {item.profile_path ? (
          <Image
            src={getImageUrl(item.profile_path, 'w500')}
            alt={item.name}
            fill
            sizes="28px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <User className="h-3 w-3" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{item.name}</p>
        <p className="text-muted-foreground text-xs">{item.known_for_department}</p>
      </div>
    </>
  );
}
