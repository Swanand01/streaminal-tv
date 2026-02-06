const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Media {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  genre_ids: number[];
}

export interface MediaDetails extends Media {
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  genres: { id: number; name: string }[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for?: Media[];
  media_type?: 'person';
}

export interface PersonDetails extends Person {
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  also_known_as: string[];
  movie_credits?: {
    cast: Array<Media & { character: string }>;
    crew: Array<Media & { job: string }>;
  };
  tv_credits?: {
    cast: Array<Media & { character: string }>;
    crew: Array<Media & { job: string }>;
  };
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number;
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  episode_count: number;
  episodes: Episode[];
}

async function fetchTMDB(endpoint: string) {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
}

export async function getTrending(mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week') {
  const data = await fetchTMDB(`/trending/${mediaType}/${timeWindow}`);
  return data.results as Media[];
}

export async function getPopularMovies() {
  const data = await fetchTMDB('/movie/popular');
  return data.results.map((item: Media) => ({ ...item, media_type: 'movie' as const })) as Media[];
}

export async function getPopularTVShows() {
  const data = await fetchTMDB('/tv/popular');
  return data.results.map((item: Media) => ({ ...item, media_type: 'tv' as const })) as Media[];
}

export async function getMovieDetails(id: number) {
  const data = await fetchTMDB(`/movie/${id}?append_to_response=credits`);
  return data as MediaDetails;
}

export async function getTVDetails(id: number) {
  const data = await fetchTMDB(`/tv/${id}?append_to_response=credits`);
  return data as MediaDetails;
}

export async function getTVSeason(tvId: number, seasonNumber: number) {
  const data = await fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`);
  return data as Season;
}

export async function searchMedia(query: string) {
  const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results.filter((item: Media) => item.media_type === 'movie' || item.media_type === 'tv') as Media[];
}

export async function searchAll(query: string) {
  const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results as (Media | Person)[];
}

export async function searchPeople(query: string) {
  const data = await fetchTMDB(`/search/person?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results as Person[];
}

export async function getPersonDetails(id: number) {
  const data = await fetchTMDB(`/person/${id}?append_to_response=movie_credits,tv_credits`);
  return data as PersonDetails;
}

export async function getPersonMovieCredits(id: number) {
  const data = await fetchTMDB(`/person/${id}/movie_credits`);
  return data.cast as (Media & { character: string })[];
}

export async function getPersonTVCredits(id: number) {
  const data = await fetchTMDB(`/person/${id}/tv_credits`);
  return data.cast as (Media & { character: string })[];
}

export function getImageUrl(path: string | null, size: 'w500' | 'w780' | 'original' = 'w500') {
  if (!path) return '/placeholder.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getTitle(media: Media) {
  return media.title || media.name || 'Untitled';
}

export function getReleaseYear(media: Media) {
  const date = media.release_date || media.first_air_date;
  return date ? new Date(date).getFullYear() : null;
}

export interface Genre {
  id: number;
  name: string;
}

export async function getMovieGenres() {
  const data = await fetchTMDB('/genre/movie/list');
  return data.genres as Genre[];
}

export async function getTVGenres() {
  const data = await fetchTMDB('/genre/tv/list');
  return data.genres as Genre[];
}

export interface DiscoverParams {
  page?: number;
  with_genres?: string;
  'vote_average.gte'?: number;
  'release_date.lte'?: string;
  sort_by?: string;
}

export async function discoverMovies(params: DiscoverParams = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  if (params.with_genres) queryParams.append('with_genres', params.with_genres);
  if (params['vote_average.gte']) queryParams.append('vote_average.gte', params['vote_average.gte'].toString());
  if (params['release_date.lte']) queryParams.append('release_date.lte', params['release_date.lte']);
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);

  const data = await fetchTMDB(`/discover/movie?${queryParams.toString()}`);
  return {
    results: data.results.map((item: Media) => ({ ...item, media_type: 'movie' as const })) as Media[],
    total_pages: data.total_pages as number,
    total_results: data.total_results as number,
    page: data.page as number,
  };
}

export async function discoverTVShows(params: DiscoverParams = {}) {
  const queryParams = new URLSearchParams();
  queryParams.append('page', (params.page || 1).toString());
  if (params.with_genres) queryParams.append('with_genres', params.with_genres);
  if (params['vote_average.gte']) queryParams.append('vote_average.gte', params['vote_average.gte'].toString());
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);

  const data = await fetchTMDB(`/discover/tv?${queryParams.toString()}`);
  return {
    results: data.results.map((item: Media) => ({ ...item, media_type: 'tv' as const })) as Media[],
    total_pages: data.total_pages as number,
    total_results: data.total_results as number,
    page: data.page as number,
  };
}

export async function getSimilarMovies(id: number) {
  const data = await fetchTMDB(`/movie/${id}/recommendations`);
  return data.results.map((item: Media) => ({ ...item, media_type: 'movie' as const })) as Media[];
}

export async function getSimilarTVShows(id: number) {
  const data = await fetchTMDB(`/tv/${id}/recommendations`);
  return data.results.map((item: Media) => ({ ...item, media_type: 'tv' as const })) as Media[];
}
