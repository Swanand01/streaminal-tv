import { Media } from './tmdb';

export interface WatchlistItem {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  slug: string;
  vote_average: number;
  added_at: number;
}

export interface ContinueWatchingItem {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  slug: string;
  vote_average: number;
  watched_at: number;
  season_number?: number;
  episode_number?: number;
  episode_name?: string;
}

export const WATCHLIST_KEY = 'streaminal_watchlist';
export const WATCHLIST_MAX = 100;
export const HISTORY_KEY = 'streaminal_history';
export const HISTORY_MAX = 20;
export const HISTORY_EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;

const cache = new Map<string, unknown[]>();
const listeners = new Map<string, Set<() => void>>();

export function readStorage<T>(key: string): T[] {
  if (!cache.has(key)) {
    let items: T[] = [];
    try {
      const raw = localStorage.getItem(key);
      items = raw ? JSON.parse(raw) : [];
    } catch {
      items = [];
    }
    cache.set(key, items);
  }
  return cache.get(key) as T[];
}

export function writeStorage<T>(key: string, items: T[]): void {
  cache.set(key, items);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
  listeners.get(key)?.forEach((listener) => listener());
}

export function subscribeStorage(key: string, listener: () => void): () => void {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);
  return () => set!.delete(listener);
}

export function toMediaItem(item: WatchlistItem): Media {
  const route = item.media_type === 'tv' ? 'tv-shows' : 'movies';
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.title,
    poster_path: item.poster_path,
    backdrop_path: null,
    overview: '',
    vote_average: item.vote_average,
    genre_ids: [],
    href: `/${route}/${item.slug}`,
  };
}

export function toContinueMedia(item: ContinueWatchingItem): Media {
  const route = item.media_type === 'tv' ? 'tv-shows' : 'movies';
  const base = `/${route}/${item.slug}`;
  const href =
    item.media_type === 'tv' && item.season_number && item.episode_number
      ? `${base}?season=${item.season_number}&episode=${item.episode_number}`
      : base;
  const subtitle =
    item.season_number && item.episode_number
      ? `S${item.season_number} E${item.episode_number}${item.episode_name ? ` · ${item.episode_name}` : ''}`
      : undefined;
  return {
    id: item.id,
    media_type: item.media_type,
    title: item.title,
    poster_path: item.poster_path,
    backdrop_path: null,
    overview: '',
    vote_average: item.vote_average,
    genre_ids: [],
    href,
    subtitle,
  };
}
