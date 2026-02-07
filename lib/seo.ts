import type { Metadata } from 'next';
import {
  getMovieDetails,
  getTVDetails,
  getPersonDetails,
  getImageUrl,
  getTitle,
  getReleaseYear,
} from '@/lib/tmdb';

export async function generateMovieMetadata(movieId: number): Promise<Metadata> {
  if (isNaN(movieId)) {
    return {
      title: 'Movie Not Found | Streaminal TV',
      description: 'The requested movie could not be found.',
    };
  }

  try {
    const movie = await getMovieDetails(movieId);
    const title = getTitle(movie);
    const year = getReleaseYear(movie);
    const rating = movie.vote_average.toFixed(1);
    const runtime = movie.runtime ? `${movie.runtime} min` : '';
    const genres = movie.genres?.map((g) => g.name).join(', ') || '';

    const pageTitle = `Watch ${title}${year ? ` (${year})` : ''} Online Free - HD | Streaminal TV`;
    const description = movie.overview
      ? movie.overview.length > 155
        ? `${movie.overview.substring(0, 152)}...`
        : movie.overview
      : `Watch ${title}${year ? ` (${year})` : ''} online free in HD. ${genres}${runtime ? ` • ${runtime}` : ''}${rating ? ` • ⭐ ${rating}/10` : ''}. Stream now on Streaminal TV.`;

    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: 'video.movie',
        images: movie.backdrop_path
          ? [{ url: getImageUrl(movie.backdrop_path, 'w780'), width: 780, height: 439 }]
          : [],
        siteName: 'Streaminal TV',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: movie.backdrop_path ? [getImageUrl(movie.backdrop_path, 'w780')] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Movie Not Found | Streaminal TV',
      description: 'The requested movie could not be found.',
    };
  }
}

export async function generateTVShowMetadata(tvId: number): Promise<Metadata> {
  if (isNaN(tvId)) {
    return {
      title: 'TV Show Not Found | Streaminal TV',
      description: 'The requested TV show could not be found.',
    };
  }

  try {
    const show = await getTVDetails(tvId);
    const title = getTitle(show);
    const year = getReleaseYear(show);
    const rating = show.vote_average.toFixed(1);
    const seasons = show.number_of_seasons
      ? `${show.number_of_seasons} Season${show.number_of_seasons > 1 ? 's' : ''}`
      : '';
    const genres = show.genres?.map((g) => g.name).join(', ') || '';

    const pageTitle = `Watch ${title}${year ? ` (${year})` : ''} Online Free - HD | Streaminal TV`;
    const description = show.overview
      ? show.overview.length > 155
        ? `${show.overview.substring(0, 152)}...`
        : show.overview
      : `Watch ${title}${year ? ` (${year})` : ''} online free in HD. ${genres}${seasons ? ` • ${seasons}` : ''}${rating ? ` • ⭐ ${rating}/10` : ''}. Stream all episodes on Streaminal TV.`;

    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: 'video.tv_show',
        images: show.backdrop_path
          ? [{ url: getImageUrl(show.backdrop_path, 'w780'), width: 780, height: 439 }]
          : [],
        siteName: 'Streaminal TV',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: show.backdrop_path ? [getImageUrl(show.backdrop_path, 'w780')] : [],
      },
    };
  } catch (error) {
    return {
      title: 'TV Show Not Found | Streaminal TV',
      description: 'The requested TV show could not be found.',
    };
  }
}

export async function generatePersonMetadata(personId: number): Promise<Metadata> {
  if (isNaN(personId)) {
    return {
      title: 'Person Not Found | Streaminal TV',
      description: 'The requested person could not be found.',
    };
  }

  try {
    const person = await getPersonDetails(personId);
    const knownFor = person.known_for_department || 'Acting';
    const biography = person.biography || '';

    const pageTitle = `${person.name} - ${knownFor} | Streaminal TV`;
    const description = biography
      ? biography.length > 155
        ? `${biography.substring(0, 152)}...`
        : biography
      : `${person.name} - Browse movies and TV shows featuring ${person.name}. Known for ${knownFor}.`;

    return {
      title: pageTitle,
      description,
      openGraph: {
        title: pageTitle,
        description,
        type: 'profile',
        images: person.profile_path
          ? [{ url: getImageUrl(person.profile_path, 'w500'), width: 500, height: 750 }]
          : [],
        siteName: 'Streaminal TV',
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: person.profile_path ? [getImageUrl(person.profile_path, 'w500')] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Person Not Found | Streaminal TV',
      description: 'The requested person could not be found.',
    };
  }
}

export function generateSearchMetadata(query: string): Metadata {
  if (!query) {
    return {
      title: 'Search Movies & TV Shows | Streaminal TV',
      description: 'Search for your favorite movies, TV shows, and actors on Streaminal TV.',
    };
  }

  return {
    title: `Search Results for "${query}" | Streaminal TV`,
    description: `Find movies, TV shows, and people matching "${query}". Browse search results on Streaminal TV.`,
    robots: {
      index: false,
      follow: true,
    },
  };
}
