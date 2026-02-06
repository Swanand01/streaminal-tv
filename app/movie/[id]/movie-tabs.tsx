'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CastList } from '@/components/cast-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, User2 } from 'lucide-react';
import type { MediaDetails, Video, Review } from '@/lib/tmdb';

interface MovieTabsProps {
    movie: MediaDetails;
    videos?: Video[];
    reviews?: Review[];
}

export function MovieTabs({ movie, videos, reviews }: MovieTabsProps) {
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    return (
        <Tabs defaultValue="cast" className="mt-8">
            <TabsList className="overflow-x-auto">
                <TabsTrigger value="cast">Cast</TabsTrigger>
                {videos && videos.length > 0 && <TabsTrigger value="videos">Videos</TabsTrigger>}
                {reviews && reviews.length > 0 && <TabsTrigger value="reviews">Reviews</TabsTrigger>}
            </TabsList>

            {/* Cast Tab */}
            <TabsContent value="cast" className="mt-6">
                {movie.credits?.cast && <CastList cast={movie.credits.cast} limit={20} />}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
                {videos && videos.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {videos.filter(video => video.site === 'YouTube').slice(0, 12).map((video) => (
                            <div
                                key={video.id}
                                className="overflow-hidden rounded-lg border border-border"
                            >
                                <div className="relative aspect-video overflow-hidden bg-muted">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title={video.name}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                    <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                        {video.type}
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="line-clamp-2 text-sm font-semibold leading-tight">
                                        {video.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
                {reviews && reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => {
                            const isExpanded = expandedReviews.has(review.id);
                            const shouldTruncate = review.content.length > 600;

                            return (
                                <div key={review.id} className="rounded-lg border border-border p-4">
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                {review.author_details.avatar_path ? (
                                                    <Image
                                                        src={
                                                            review.author_details.avatar_path.startsWith('/https')
                                                                ? review.author_details.avatar_path.slice(1)
                                                                : `https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`
                                                        }
                                                        alt={review.author}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <User2 className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{review.author}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {review.author_details.rating && (
                                            <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                <span className="text-sm font-semibold">
                                                    {review.author_details.rating}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm leading-relaxed text-foreground/90">
                                        <p className={!isExpanded && shouldTruncate ? 'line-clamp-6' : ''}>
                                            {review.content}
                                        </p>
                                        {shouldTruncate && (
                                            <button
                                                onClick={() => {
                                                    setExpandedReviews((prev) => {
                                                        const next = new Set(prev);
                                                        if (isExpanded) {
                                                            next.delete(review.id);
                                                        } else {
                                                            next.add(review.id);
                                                        }
                                                        return next;
                                                    });
                                                }}
                                                className="mt-2 text-sm font-medium text-primary hover:underline"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No reviews available</p>
                )}
            </TabsContent>
        </Tabs>
    );
}
