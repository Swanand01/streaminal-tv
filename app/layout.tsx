import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { Footer } from '@/components/footer';
import NextTopLoader from 'nextjs-toploader';

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_BASE_URL && {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL),
  }),
  title: {
    default: 'Streaminal TV - Watch Movies & TV Shows Online Free',
    template: '%s',
  },
  description:
    'Watch thousands of movies and TV shows online free in HD. Stream trending content, browse by genre, and discover your next favorite show on Streaminal TV - no subscription required.',
  keywords: [
    'watch movies online free',
    'free tv shows',
    'streaming free',
    'watch online',
    'hd movies',
    'free streaming site',
    'movies',
    'tv shows',
  ],
  authors: [{ name: 'Streaminal TV' }],
  creator: 'Streaminal TV',
  publisher: 'Streaminal TV',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://streaminal.tv',
    siteName: 'Streaminal TV',
    title: 'Streaminal TV - Watch Movies & TV Shows Online Free',
    description:
      'Watch thousands of movies and TV shows online free in HD. Stream trending content without subscription.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Streaminal TV - Watch Movies & TV Shows Online Free',
    description: 'Watch thousands of movies and TV shows online free in HD.',
    creator: '@streaminal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${figtree.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <NextTopLoader color="#f49f1e" showSpinner={false} />
        <QueryProvider>
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
