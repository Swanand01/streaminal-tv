import { discoverTVShows, getTVGenres } from '@/lib/tmdb';
import { BrowseContent } from '@/components/browse-content';

export async function TVShows() {
  const [genres, initialTVShowsData] = await Promise.all([
    getTVGenres().catch(() => []),
    discoverTVShows({
      page: 1,
      sort_by: 'popularity.desc',
    }).catch(() => ({ results: [], total_pages: 0, total_results: 0 })),
  ]);

  return (
    <BrowseContent
      mediaType="tv"
      title="TV Shows"
      initialGenres={genres}
      initialData={initialTVShowsData}
    />
  );
}
