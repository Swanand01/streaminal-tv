'use client';

import { Genre } from '@/lib/tmdb';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FiltersSidebarProps {
  genres: Genre[];
  selectedGenres: number[];
  minRating: number;
  onGenreToggle: (genreId: number) => void;
  onRatingChange: (rating: number) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const RATING_OPTIONS = [
  { value: 0, label: 'All' },
  { value: 5, label: '5+' },
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
  { value: 9, label: '9+' },
];

export function FiltersSidebar({
  genres,
  selectedGenres,
  minRating,
  onGenreToggle,
  onRatingChange,
  onClose,
  showCloseButton = false,
}: FiltersSidebarProps) {
  return (
    <div className="space-y-6">
      {showCloseButton && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Genre Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Genres</Label>
        <div className="scrollbar-hide max-h-64 space-y-2 overflow-y-auto">
          {genres.map((genre) => (
            <label
              key={genre.id}
              className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => onGenreToggle(genre.id)}
                className="border-border bg-background accent-primary h-4 w-4 rounded"
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Minimum Rating</Label>
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onRatingChange(option.value)}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                minRating === option.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
