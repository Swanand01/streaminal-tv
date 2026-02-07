'use client';

import { CastList } from '@/components/cast-list';
import { VideosList } from '@/components/videos-list';
import { ReviewsList } from '@/components/reviews-list';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { MediaDetails, Video, Review } from '@/lib/tmdb';

interface MovieTabsProps {
  movie: MediaDetails;
  videos?: Video[];
  reviews?: Review[];
}

export function MovieTabs({ movie, videos, reviews }: MovieTabsProps) {
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
        <VideosList videos={videos} />
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews" className="mt-6">
        <ReviewsList reviews={reviews} />
      </TabsContent>
    </Tabs>
  );
}
