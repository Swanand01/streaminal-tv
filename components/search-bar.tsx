'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SearchSuggestions } from '@/components/search-suggestions';
import { useSearchSuggestions } from '@/hooks/use-search-suggestions';
import { generateSlug } from '@/lib/utils';
import { Media, Person, getTitle } from '@/lib/tmdb';

function isPerson(item: Media | Person): item is Person {
  return item.media_type === 'person';
}

interface SearchBarProps {
  onClose: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: suggestions, isLoading } = useSearchSuggestions(query);

  const totalItems = suggestions ? suggestions.length + 1 : 0; // +1 for "View all"

  const navigateToItem = useCallback(
    (item: Media | Person) => {
      if (isPerson(item)) {
        router.push(`/people/${generateSlug(item.name, item.id)}`);
      } else {
        const mediaType = item.media_type || 'movie';
        const route = mediaType === 'tv' ? 'tv-shows' : 'movies';
        router.push(`/${route}/${generateSlug(getTitle(item), item.id)}`);
      }
      setQuery('');
      setShowSuggestions(false);
      onClose();
    },
    [router, onClose]
  );

  const handleFullSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
      setShowSuggestions(false);
      onClose();
    }
  }, [query, router, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || !suggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFullSearch();
      } else if (e.key === 'Escape') {
        onClose();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          navigateToItem(suggestions[selectedIndex]);
        } else {
          handleFullSearch();
        }
        break;
      case 'Escape':
        e.preventDefault();
        if (showSuggestions && query.trim().length >= 2) {
          setShowSuggestions(false);
        } else {
          onClose();
        }
        break;
    }
  };

  // Click outside to dismiss
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex flex-1 items-center gap-2 md:flex-none">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search movies, TV shows..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedIndex(-1);
          if (e.target.value.trim().length >= 2) {
            setShowSuggestions(true);
          }
        }}
        onKeyDown={handleKeyDown}
        className="w-full md:w-75"
        autoFocus
      />
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground shrink-0 text-sm"
      >
        Cancel
      </button>
      {showSuggestions && (
        <SearchSuggestions
          results={suggestions}
          isLoading={isLoading}
          query={query}
          selectedIndex={selectedIndex}
          onSelect={navigateToItem}
          onViewAll={handleFullSearch}
        />
      )}
    </div>
  );
}
