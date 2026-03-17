import type { NextConfig } from 'next';

const sportsApiUrl = process.env.NEXT_PUBLIC_SPORTS_API_URL;
if (!sportsApiUrl) throw new Error('NEXT_PUBLIC_SPORTS_API_URL environment variable is not set');
const sportsHostname = new URL(sportsApiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL: 2592000, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 160, 200, 256, 384],
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

import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev());
