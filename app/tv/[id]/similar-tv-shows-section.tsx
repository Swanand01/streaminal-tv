import Image from 'next/image';
import { Media } from '@/lib/tmdb';
import { Star } from 'lucide-react';

interface SimilarTVShowsSectionProps {
    shows?: Media[];
}

export function SimilarTVShowsSection({ shows }: SimilarTVShowsSectionProps) {
    if (!shows || shows.length === 0) return null;

    return (
        <aside className=" w-full lg:block lg:w-80 xl:w-96">
            <h2 className="mb-4 text-xl font-bold">More Like This</h2>
            <div className="grid grid-cols-2 gap-2">
                {shows.slice(0, 6).map((item) => (
                    <SimilarTVShowCard key={item.id} show={item} />
                ))}
            </div>
        </aside>
    );
}

function SimilarTVShowCard({ show }: { show: Media }) {
    return (
        <a
            href={`/tv/${show.id}`}
            className="group relative overflow-hidden rounded-lg border border-border transition-colors hover:border-primary/50"
        >
            <div className="relative aspect-video overflow-hidden bg-muted">
                {show.backdrop_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${show.backdrop_path}`}
                        alt={show.title || show.name || ''}
                        fill
                        sizes="(max-width: 1024px) 100vw, 300px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <span className="text-xs">No Image</span>
                    </div>
                )}
                {show.vote_average > 0 && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                            {show.vote_average.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>
            <div className="p-3">
                <p className="line-clamp-2 text-sm font-semibold">
                    {show.title || show.name}
                </p>
            </div>
        </a>
    );
}
