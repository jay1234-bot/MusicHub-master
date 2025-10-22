/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // Disable server-side features for static export
  distDir: 'out',
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
  // Static export specific settings
  async generateBuildId() {
    return 'build';
  }
};

// Apply PWA configuration
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Exclude specific files from PWA for static export
  buildExcludes: [
    /middleware-manifest\.json$/,
    /\.map$/,
    /^.*\/_error.*$/,
    /chunk-map\.json$/,
    /app-build-manifest\.json$/,
    /font-manifest\.json$/
  ]
});

export default withPWAConfig(nextConfig);
