import { cache } from 'react';

const SPORTS_BASE_URL = process.env.NEXT_PUBLIC_SPORTS_API_URL!.replace(/\/+$/, '');

export interface MatchTeam {
  name: string;
  badge: string;
}

export interface MatchSource {
  source: string;
  id: string;
}

export interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  poster?: string;
  popular: boolean;
  teams?: {
    home?: MatchTeam;
    away?: MatchTeam;
  };
  sources: MatchSource[];
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

async function fetchSports(endpoint: string) {
  const response = await fetch(`${SPORTS_BASE_URL}${endpoint}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`Sports API error: ${response.statusText}`);
  }
  return response.json();
}

export const getLiveMatches = cache(async (): Promise<Match[]> => {
  return fetchSports('/matches/live');
});

export async function getMatchStreams(source: string, id: string): Promise<Stream[]> {
  return fetchSports(`/stream/${source}/${id}`);
}

export function getBadgeUrl(id: string): string {
  return `${SPORTS_BASE_URL}/images/badge/${id}.webp`;
}
