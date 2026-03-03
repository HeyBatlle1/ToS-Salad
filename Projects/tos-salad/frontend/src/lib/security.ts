import { createHash } from 'crypto'
import { NextRequest } from 'next/server'

// ─── Constants ────────────────────────────────────────────────────────────────

const CHAT_WINDOW_MS   = 60 * 60 * 1000   // 1 hour
const CHAT_MAX_REQ     = 15               // requests per hour per IP
const INPUT_MAX_LENGTH = 800              // chars — plenty for any real question
const CLEANUP_INTERVAL = 24 * 60 * 60    // clean old rows every 24h

// ─── IP Helpers ───────────────────────────────────────────────────────────────

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp    = request.headers.get('x-real-ip')
  const cfIp      = request.headers.get('cf-connecting-ip')     // Cloudflare
  const raw = cfIp || realIp || forwarded?.split(',')[0]?.trim() || 'unknown'
  // Hash the IP so we never store PII in the DB
  return createHash('sha256').update(raw).digest('hex').slice(0, 32)
}

// ─── Serverless-safe Rate Limiting (NeonDB backed) ────────────────────────────

export async function checkRateLimit(
  ipHash: string,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetInMs: number }> {
  const { Pool } = await import('pg')
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })

  const key = `${endpoint}:${ipHash}`
  const windowStart = new Date(Date.now() - CHAT_WINDOW_MS)

  try {
    // Upsert: if window is old, reset; otherwise increment
    const result = await pool.query<{ count: number; window_start: Date }>(`
      INSERT INTO rate_limits (key, count, window_start)
      VALUES ($1, 1, NOW())
      ON CONFLICT (key) DO UPDATE
        SET count        = CASE
                            WHEN rate_limits.window_start < $2
                            THEN 1
                            ELSE rate_limits.count + 1
                           END,
            window_start = CASE
                            WHEN rate_limits.window_start < $2
                            THEN NOW()
                            ELSE rate_limits.window_start
                           END
      RETURNING count, window_start
    `, [key, windowStart])

    const { count, window_start } = result.rows[0]
    const resetInMs = CHAT_WINDOW_MS - (Date.now() - new Date(window_start).getTime())

    // Periodically clean old rows (probabilistic 1%)
    if (Math.random() < 0.01) {
      pool.query(`DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '${CLEANUP_INTERVAL} seconds'`)
        .catch(() => {}) // fire and forget
    }

    return {
      allowed: count <= CHAT_MAX_REQ,
      remaining: Math.max(0, CHAT_MAX_REQ - count),
      resetInMs: Math.max(0, resetInMs),
    }
  } finally {
    await pool.end()
  }
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

export function sanitizeInput(raw: string): { safe: string; blocked: boolean; reason?: string } {
  if (typeof raw !== 'string') return { safe: '', blocked: true, reason: 'invalid_type' }

  // Length check
  if (raw.length > INPUT_MAX_LENGTH) {
    return { safe: '', blocked: true, reason: 'too_long' }
  }

  // Strip null bytes and non-printable control characters (keep newlines/tabs)
  const cleaned = raw.replace(/\x00/g, '').replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Prompt injection patterns — block attempts to override the system
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions?/i,
    /forget\s+(everything|all|prior|previous)/i,
    /you\s+are\s+now\s+a?\s*(new|different|evil|uncensored|jailbreak)/i,
    /act\s+as\s+(if\s+you\s+are\s+)?(a\s+)?(different|new|evil|unrestricted)/i,
    /disregard\s+(your\s+)?(previous|prior|all)\s+(instructions?|guidelines?|rules?)/i,
    /pretend\s+(you\s+are|to\s+be)\s+(a\s+)?(different|unrestricted|evil)/i,
    /\[SYSTEM\]/i,
    /\<\|im_start\|\>/i,
    /\/\/\s*system\s*:/i,
  ]

  for (const pattern of injectionPatterns) {
    if (pattern.test(cleaned)) {
      return { safe: '', blocked: true, reason: 'injection_attempt' }
    }
  }

  return { safe: cleaned.trim(), blocked: false }
}

// ─── Response Headers ─────────────────────────────────────────────────────────

export function securityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options':  'nosniff',
    'X-Frame-Options':         'DENY',
    'X-XSS-Protection':        '1; mode=block',
    'Referrer-Policy':         'strict-origin-when-cross-origin',
    'Permissions-Policy':      'camera=(), microphone=(), geolocation=()',
    'Cache-Control':           'no-store',
  }
}
