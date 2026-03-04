'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type SportsSidebarProps =
  | { sports: string[]; selectedSports: string[]; onSportToggle: (sport: string) => void; showCloseButton?: false; onClose?: never }
  | { sports: string[]; selectedSports: string[]; onSportToggle: (sport: string) => void; showCloseButton: true; onClose: () => void };

export function SportsSidebar({
  sports,
  selectedSports,
  onSportToggle,
  onClose,
  showCloseButton = false,
}: SportsSidebarProps) {
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

      <div className="space-y-3">
        <Label className="text-md font-semibold">Sport</Label>
        <div className="space-y-2">
          {sports.map((sport) => (
            <label
              key={sport}
              className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedSports.includes(sport)}
                onChange={() => onSportToggle(sport)}
                className="border-border bg-background accent-primary h-4 w-4 rounded"
              />
              <span className="capitalize">{sport}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
