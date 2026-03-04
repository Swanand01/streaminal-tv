'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Match, getLiveMatches } from '@/lib/sports';
import { MatchCard } from '@/components/sports/match-card';
import { SportsSidebar } from '@/components/sports/sports-sidebar';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface SportsContentProps {
  initialLive: Match[];
}

export function SportsContent({ initialLive }: SportsContentProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const { data: liveMatches = initialLive } = useQuery({
    queryKey: ['sports', 'live'],
    queryFn: getLiveMatches,
    initialData: initialLive,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const handleSportToggle = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId]
    );
  };

  const availableSports = Array.from(new Set(liveMatches.map((m) => m.category))).sort();

  const visibleMatches =
    selectedSports.length === 0
      ? liveMatches
      : liveMatches.filter((m) => selectedSports.includes(m.category));

  return (
    <div className="container mx-auto px-4 pt-24 md:px-8 lg:px-12">
      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <SportsSidebar
              sports={availableSports}
              selectedSports={selectedSports}
              onSportToggle={handleSportToggle}
            />
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="bg-background fixed inset-0 z-50 overflow-y-auto p-6 lg:hidden">
            <SportsSidebar
              sports={availableSports}
              selectedSports={selectedSports}
              onSportToggle={handleSportToggle}
              onClose={() => setShowMobileFilters(false)}
              showCloseButton
            />
          </div>
        )}

        {/* Main Content */}
        <main className="min-w-0 flex-1 pb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Sports</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {visibleMatches.length} live {visibleMatches.length === 1 ? 'match' : 'matches'}
              </p>
            </div>
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

          {visibleMatches.length === 0 ? (
            <div className="flex min-h-100 items-center justify-center">
              <p className="text-muted-foreground">
                {liveMatches.length === 0
                  ? 'No live matches right now. Check back soon.'
                  : 'No live matches for the selected sport.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visibleMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
