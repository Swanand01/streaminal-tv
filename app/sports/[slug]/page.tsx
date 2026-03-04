import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { SportsDetailsSkeleton } from '@/components/skeletons/sports-details-skeleton';
import { MatchContent } from './match-content';
import { getLiveMatches } from '@/lib/sports';
import { extractMatchIdFromSlug } from '@/lib/utils';

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const matchId = extractMatchIdFromSlug(slug);
  const liveMatches = await getLiveMatches().catch(() => []);
  const match = liveMatches.find((m) => m.id === matchId);

  if (!match) {
    return {
      title: 'Match Not Found | Streaminal TV',
      description: 'The requested match could not be found.',
    };
  }

  return {
    title: `Watch ${match.title} Live | Streaminal TV`,
    description: `Stream ${match.title} live online free on Streaminal TV.`,
    openGraph: {
      title: `Watch ${match.title} Live | Streaminal TV`,
      description: `Stream ${match.title} live online free.`,
      type: 'website',
      siteName: 'Streaminal TV',
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { slug } = await params;
  const matchId = extractMatchIdFromSlug(slug);

  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<SportsDetailsSkeleton />}>
        <MatchContent matchId={matchId ?? ''} />
      </Suspense>
    </div>
  );
}
