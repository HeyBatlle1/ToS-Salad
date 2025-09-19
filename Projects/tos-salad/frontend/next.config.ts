import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // API routes timeout configuration
  api: {
    responseLimit: '8mb',
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },
};

export default nextConfig;
