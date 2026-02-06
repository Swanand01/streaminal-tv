import { discoverMovies, getMovieGenres } from '@/lib/tmdb';
import { MoviesContent } from './movies-content';

export async function Movies() {
    const today = new Date().toISOString().split('T')[0];

    const [genres, initialMoviesData] = await Promise.all([
        getMovieGenres().catch(() => []),
        discoverMovies({
            page: 1,
            sort_by: 'popularity.desc',
            'release_date.lte': today,
        }).catch(() => ({ results: [], total_pages: 0, total_results: 0 })),
    ]);

    return <MoviesContent initialGenres={genres} initialMovies={initialMoviesData} />;
}
