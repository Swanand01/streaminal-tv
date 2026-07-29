import { useRef, useSyncExternalStore } from 'react';
import {
  ContinueWatchingItem,
  HISTORY_KEY,
  HISTORY_MAX,
  HISTORY_EXPIRE_MS,
  readStorage,
  writeStorage,
  subscribeStorage,
} from '@/lib/storage';

const EMPTY: ContinueWatchingItem[] = [];

export function useContinueWatching() {
  const filteredCacheRef = useRef<{
    raw: ContinueWatchingItem[];
    filtered: ContinueWatchingItem[];
  }>(null);

  const continueWatching = useSyncExternalStore(
    (onStoreChange) => subscribeStorage(HISTORY_KEY, onStoreChange),
    () => {
      const raw = readStorage<ContinueWatchingItem>(HISTORY_KEY);
      if (filteredCacheRef.current?.raw !== raw) {
        const now = Date.now();
        filteredCacheRef.current = {
          raw,
          filtered: raw.filter((item) => now - item.watched_at < HISTORY_EXPIRE_MS),
        };
      }
      return filteredCacheRef.current.filtered;
    },
    () => EMPTY
  );

  const track = (item: Omit<ContinueWatchingItem, 'watched_at'>) => {
    const current = readStorage<ContinueWatchingItem>(HISTORY_KEY);
    const filtered = current.filter((w) => !(w.id === item.id && w.media_type === item.media_type));
    const newItem: ContinueWatchingItem = { ...item, watched_at: Date.now() };
    const updated = [newItem, ...filtered].slice(0, HISTORY_MAX);
    writeStorage(HISTORY_KEY, updated);
  };

  const remove = (id: number, media_type: 'movie' | 'tv') => {
    const current = readStorage<ContinueWatchingItem>(HISTORY_KEY);
    const updated = current.filter((w) => !(w.id === id && w.media_type === media_type));
    writeStorage(HISTORY_KEY, updated);
  };

  const getProgress = (id: number): { season_number: number; episode_number: number } | null => {
    const item = continueWatching.find((w) => w.id === id && w.media_type === 'tv');
    if (!item?.season_number || !item?.episode_number) return null;
    return { season_number: item.season_number, episode_number: item.episode_number };
  };

  return { continueWatching, track, remove, getProgress };
}
