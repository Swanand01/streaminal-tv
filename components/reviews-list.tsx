'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, User2 } from 'lucide-react';
import type { Review } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReviewsListProps {
  reviews?: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground text-center">No reviews available</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const shouldTruncate = review.content.length > 600;

        return (
          <div key={review.id} className="border-border rounded-lg border p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
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
                    <User2 className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {review.author_details.rating && (
                <Badge variant="secondary">
                  <Star className="fill-primary text-primary h-3 w-3" />
                  {review.author_details.rating}
                </Badge>
              )}
            </div>
            <div className="text-foreground/90 text-md leading-relaxed">
              <p className={!isExpanded && shouldTruncate ? 'line-clamp-6' : ''}>
                {review.content}
              </p>
              {shouldTruncate && (
                <Button
                  variant="link"
                  size="default"
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
                  className="mt-2 px-0"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
