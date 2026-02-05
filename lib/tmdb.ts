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
  return data.results as Media[];
}

export async function getPopularTVShows() {
  const data = await fetchTMDB('/tv/popular');
  return data.results as Media[];
}

export async function getMovieDetails(id: number) {
  const data = await fetchTMDB(`/movie/${id}?append_to_response=credits`);
  return data as MediaDetails;
}

export async function getTVDetails(id: number) {
  const data = await fetchTMDB(`/tv/${id}?append_to_response=credits`);
  return data as MediaDetails;
}

export async function searchMedia(query: string) {
  const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
  return data.results.filter((item: Media) => item.media_type === 'movie' || item.media_type === 'tv') as Media[];
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
