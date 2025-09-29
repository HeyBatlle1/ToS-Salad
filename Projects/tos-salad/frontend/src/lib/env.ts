// Environment variable validation and handling

interface RequiredEnvVars {
  DATABASE_URL: string
  GOOGLE_GEMINI_API_KEY: string
}

interface OptionalEnvVars {
  CACHE_TTL_SECONDS?: string
  NODE_ENV?: string
  NETLIFY?: string
}

type EnvVars = RequiredEnvVars & OptionalEnvVars

// Get environment variables without validation (for build time)
export const env = {
  // Use Neon's Netlify integration variable names
  DATABASE_URL: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || '',
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY || '',
  CACHE_TTL_SECONDS: process.env.CACHE_TTL_SECONDS,
  NODE_ENV: process.env.NODE_ENV,
  NETLIFY: process.env.NETLIFY,
}

// Validate environment variables at runtime
export function validateRequiredEnv(): void {
  const missing: string[] = []

  // Check for database URL (Neon provides NETLIFY_DATABASE_URL)
  if (!process.env.NETLIFY_DATABASE_URL && !process.env.DATABASE_URL) {
    missing.push('DATABASE_URL (or NETLIFY_DATABASE_URL)')
  }

  // Check for Gemini API key
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    missing.push('GOOGLE_GEMINI_API_KEY')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or Netlify environment settings.'
    )
  }
}

// Helper functions
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isNetlify = Boolean(env.NETLIFY)
export const cacheTimeout = parseInt(env.CACHE_TTL_SECONDS || '60') * 1000

// Log environment status (safe for production)
if (isDevelopment) {
  console.log('Environment variables loaded:', {
    NODE_ENV: env.NODE_ENV,
    DATABASE_URL: env.DATABASE_URL ? '✓ Set' : '✗ Missing',
    NETLIFY_DATABASE_URL: process.env.NETLIFY_DATABASE_URL ? '✓ Set' : '✗ Missing',
    GOOGLE_GEMINI_API_KEY: env.GOOGLE_GEMINI_API_KEY ? '✓ Set' : '✗ Missing',
    NETLIFY: isNetlify ? '✓ Netlify detected' : '✗ Not Netlify',
  })
}