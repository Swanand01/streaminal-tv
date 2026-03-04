import type { NextConfig } from 'next';

const sportsApiUrl = process.env.NEXT_PUBLIC_SPORTS_API_URL;
if (!sportsApiUrl) throw new Error('SPORTS_API_URL environment variable is not set');
const sportsHostname = new URL(sportsApiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: sportsHostname,
        pathname: '/api/images/**',
      },
    ],
  },
};

export default nextConfig;
