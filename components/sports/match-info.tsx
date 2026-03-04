import Image from 'next/image';
import { Match, getBadgeUrl } from '@/lib/sports';
import { Badge } from '@/components/ui/badge';

interface MatchInfoProps {
  match: Match;
}

export function MatchInfo({ match }: MatchInfoProps) {
  const home = match.teams?.home;
  const away = match.teams?.away;

  return (
    <div className="mb-8">
      <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{match.title}</h1>

      <div className="text-muted-foreground text-md flex flex-wrap items-center gap-4">
        <Badge variant="outline" className="capitalize">
          {match.category}
        </Badge>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-red-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Live Now
        </span>
      </div>

      {(home || away) && (
        <div className="mt-6 flex items-center gap-6">
          {home && (
            <div className="flex items-center gap-3">
              {home.badge && (
                <div className="relative h-10 w-10">
                  <Image
                    src={getBadgeUrl(home.badge)}
                    alt={home.name}
                    fill
                    sizes="40px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <span className="font-medium">{home.name}</span>
            </div>
          )}
          <span className="text-muted-foreground font-bold">vs</span>
          {away && (
            <div className="flex items-center gap-3">
              {away.badge && (
                <div className="relative h-10 w-10">
                  <Image
                    src={getBadgeUrl(away.badge)}
                    alt={away.name}
                    fill
                    sizes="40px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
              <span className="font-medium">{away.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
