/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Image optimization for static export
  images: {
    unoptimized: true,
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'image-cdn-fa.spotifycdn.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.scdn.co',
      },
      {
        protocol: 'https',
        hostname: '**.spotifycdn.com',
      },
    ],
  },
  // Performance optimizations
  swcMinify: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Disable middleware warning for static export
  async rewrites() {
    return [];
  }
};

// Apply PWA configuration
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Exclude specific files from PWA
  buildExcludes: [
    /middleware-manifest\.json$/,
    /\.map$/,
    /^.*\/_error.*$/,
  ]
});

export default withPWAConfig(nextConfig);
