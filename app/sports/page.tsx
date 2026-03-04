import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import { SportsContentSkeleton } from '@/components/skeletons/sports-content-skeleton';
import { Sports } from './sports';

export const metadata: Metadata = {
  title: 'Watch Live Sports Online Free | Streaminal TV',
  description:
    'Watch live sports online free. Stream football, basketball, tennis, MMA, boxing and more without subscription on Streaminal TV.',
  alternates: {
    canonical: '/sports',
  },
  openGraph: {
    title: 'Watch Live Sports Online Free | Streaminal TV',
    description: 'Watch live sports online free. Stream football, basketball, tennis, MMA, boxing and more.',
    type: 'website',
    siteName: 'Streaminal TV',
  },
  twitter: {
    card: 'summary',
    title: 'Watch Live Sports Online Free | Streaminal TV',
    description: 'Watch live sports online free. Stream football, basketball, tennis, MMA, boxing and more.',
  },
};

export default function SportsPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <Suspense fallback={<SportsContentSkeleton />}>
        <Sports />
      </Suspense>
    </div>
  );
}
