import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Netlify, let the plugin handle deployment - no output mode needed

  // Configure external packages for server components
  serverExternalPackages: ['pg'],

  // Optimize for production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Image optimization for Netlify
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    unoptimized: false, // Keep optimization for better performance
  },

  // Configure for Netlify Functions
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
  },

  // Skip ESLint during build for now
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript type checking during build for now
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
