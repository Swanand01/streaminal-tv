import type { Metadata } from 'next';
import { Geist, Geist_Mono, Figtree } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
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
  title: 'Streaminal - Watch Movies & TV Shows',
  description: 'Stream trending movies and TV shows in high quality',
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
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
