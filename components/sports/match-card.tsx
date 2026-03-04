import Link from 'next/link';
import Image from 'next/image';
import { Match, getBadgeUrl } from '@/lib/sports';
import { Badge } from '@/components/ui/badge';
import { generateMatchSlug } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const home = match.teams?.home;
  const away = match.teams?.away;

  // Fall back to parsing the title ("Team A vs Team B") when team data isn't populated yet
  const titleParts = match.title.split(/ vs\.? /i);
  const homeName = home?.name || titleParts[0]?.trim() || 'TBD';
  const awayName = away?.name || titleParts[1]?.trim() || 'TBD';

  return (
    <Link
      href={`/sports/${generateMatchSlug(match.title, match.id)}`}
      className="bg-card border-border group block rounded-lg border p-4 transition-colors hover:border-white/20"
    >
      {/* Header: sport + live indicator */}
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {match.category}
        </Badge>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          LIVE
        </span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-2">
        {/* Home team */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
          {home?.badge ? (
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src={getBadgeUrl(home.badge)}
                alt={homeName}
                fill
                sizes="48px"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="bg-muted h-12 w-12 shrink-0 rounded-full" />
          )}
          <span className="text-foreground line-clamp-2 text-sm leading-tight font-medium">
            {homeName}
          </span>
        </div>

        {/* VS */}
        <span className="text-muted-foreground shrink-0 text-xs font-bold">VS</span>

        {/* Away team */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
          {away?.badge ? (
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src={getBadgeUrl(away.badge)}
                alt={awayName}
                fill
                sizes="48px"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <div className="bg-muted h-12 w-12 shrink-0 rounded-full" />
          )}
          <span className="text-foreground line-clamp-2 text-sm leading-tight font-medium">
            {awayName}
          </span>
        </div>
      </div>
    </Link>
  );
}
