import { discoverTVShows, getTVGenres } from '@/lib/tmdb';
import { TVShowsContent } from './tv-shows-content';

export async function TVShows() {
  const [genres, initialTVShowsData] = await Promise.all([
    getTVGenres().catch(() => []),
    discoverTVShows({
      page: 1,
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [], total_pages: 0, total_results: 0 })),
  ]);

  return <TVShowsContent initialGenres={genres} initialTVShows={initialTVShowsData} />;
}
