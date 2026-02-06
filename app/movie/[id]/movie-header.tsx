import { MediaDetails } from '@/lib/tmdb';
import { Star, Calendar, Clock } from 'lucide-react';

interface MovieHeaderProps {
    movie: MediaDetails;
}

export function MovieHeader({ movie }: MovieHeaderProps) {
    const title = movie.title || 'Untitled';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

    return (
        <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">{title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {year && (
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{year}</span>
                    </div>
                )}
                {movie.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium text-foreground">{movie.vote_average.toFixed(1)}</span>
                    </div>
                )}
                {movie.runtime && (
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    </div>
                )}
            </div>

            {movie.genres && movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                        <span
                            key={genre.id}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
            )}

            {movie.overview && (
                <p className="mt-4 text-pretty leading-relaxed text-foreground/90">
                    {movie.overview}
                </p>
            )}
        </div>
    );
}
