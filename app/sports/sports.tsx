import { getLiveMatches } from '@/lib/sports';
import { SportsContent } from '@/components/sports/sports-content';

export async function Sports() {
  const liveMatches = await getLiveMatches().catch(() => []);
  return <SportsContent initialLive={liveMatches} />;
}
