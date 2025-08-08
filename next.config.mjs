/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // Next.js configuration
  // Image optimization
  images: {
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'image-cdn-fa.spotifycdn.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 1800,
  },
  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  }
};

// Apply PWA configuration
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

export default withPWAConfig(nextConfig);
