import { useSyncExternalStore } from 'react';
import {
  WatchlistItem,
  WATCHLIST_KEY,
  WATCHLIST_MAX,
  readStorage,
  writeStorage,
  subscribeStorage,
} from '@/lib/storage';

const EMPTY: WatchlistItem[] = [];

export function useWatchlist() {
  const watchlist = useSyncExternalStore(
    (onStoreChange) => subscribeStorage(WATCHLIST_KEY, onStoreChange),
    () => readStorage<WatchlistItem>(WATCHLIST_KEY),
    () => EMPTY
  );

  const add = (item: Omit<WatchlistItem, 'added_at'>) => {
    const current = readStorage<WatchlistItem>(WATCHLIST_KEY);
    if (current.some((w) => w.id === item.id && w.media_type === item.media_type)) return;
    const newItem: WatchlistItem = { ...item, added_at: Date.now() };
    const updated = [newItem, ...current];
    const trimmed =
      updated.length > WATCHLIST_MAX
        ? updated.sort((a, b) => b.added_at - a.added_at).slice(0, WATCHLIST_MAX)
        : updated;
    writeStorage(WATCHLIST_KEY, trimmed);
  };

  const remove = (id: number, media_type: 'movie' | 'tv') => {
    const current = readStorage<WatchlistItem>(WATCHLIST_KEY);
    const updated = current.filter((w) => !(w.id === id && w.media_type === media_type));
    writeStorage(WATCHLIST_KEY, updated);
  };

  const isInWatchlist = (id: number, media_type: 'movie' | 'tv') =>
    watchlist.some((w) => w.id === id && w.media_type === media_type);

  return { watchlist, add, remove, isInWatchlist };
}
