import { getLiveMatches } from '@/lib/sports';
import { SportsPlayer } from '@/components/sports/sports-player';
import { MatchInfo } from '@/components/sports/match-info';

interface MatchContentProps {
  matchId: string;
}

export async function MatchContent({ matchId }: MatchContentProps) {
  const liveMatches = await getLiveMatches().catch(() => []);
  const match = liveMatches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">Match not found or no longer live</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <SportsPlayer sources={match.sources} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12">
        <MatchInfo match={match} />
      </div>
    </>
  );
}
