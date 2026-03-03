import { NextRequest, NextResponse } from 'next/server'
import { getClientIP, checkRateLimit, securityHeaders } from '@/lib/security'
import { analyzeToSDocument } from '@/lib/gemini'
import { Pool } from 'pg'

const ANALYZE_MAX_REQ  = 5              // per hour — Gemini calls are expensive
const FETCH_TIMEOUT_MS = 15_000
const MAX_CONTENT_BYTES = 500_000       // 500 KB — then we truncate

// Private IP ranges — block SSRF
const PRIVATE_IP_RE = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|::1$|localhost)/i

function isPrivateHost(hostname: string): boolean {
  return PRIVATE_IP_RE.test(hostname)
}

/** Strip HTML tags and collapse whitespace for Gemini analysis */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{3,}/g, '\n\n')
    .trim()
}

/** Derive risk level from a 1-9 transparency score */
function scoreToRisk(score: number): string {
  if (score >= 8) return 'Low'
  if (score >= 6) return 'Medium'
  if (score >= 4) return 'High'
  return 'Critical'
}

export async function POST(request: NextRequest) {
  const headers = securityHeaders()

  // ── Rate limit ──────────────────────────────────────────────────────────────
  const ipHash = getClientIP(request)
  const { allowed, remaining } = await checkRateLimit(ipHash, 'analyze')
    .then(r => ({
      allowed: r.remaining < (15 - ANALYZE_MAX_REQ + 1) ? false : r.allowed,
      remaining: r.remaining,
    }))
    .catch(() => ({ allowed: true, remaining: ANALYZE_MAX_REQ }))

  // Use a separate rate limit key so analyze has its own stricter bucket
  const analyzeLimit = await checkRateLimit(ipHash + ':analyze', 'analyze')
    .catch(() => ({ allowed: true, remaining: ANALYZE_MAX_REQ }))

  if (!analyzeLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit reached. You can run 5 analyses per hour.' },
      { status: 429, headers: { ...headers, 'Retry-After': '3600' } }
    )
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: { company_name?: string; tos_url?: string; tos_text?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  const companyName = (body.company_name ?? '').trim()
  if (!companyName || companyName.length > 200) {
    return NextResponse.json({ error: 'Company name is required (max 200 chars)' }, { status: 400, headers })
  }

  let tosUrl: string | null = null
  let tosContent = ''

  if (body.tos_url) {
    // ── Fetch ToS from URL ────────────────────────────────────────────────────
    let parsedUrl: URL
    try {
      parsedUrl = new URL(body.tos_url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400, headers })
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: 'Only http and https URLs are allowed' }, { status: 400, headers })
    }

    if (isPrivateHost(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'Cannot fetch from private network addresses' }, { status: 400, headers })
    }

    tosUrl = parsedUrl.href

    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
      const res = await fetch(tosUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'ToSSalad-Transparency-Bot/1.0 (https://tossalad.netlify.app; educational)',
          'Accept': 'text/html,text/plain',
        },
      })
      clearTimeout(timer)

      const contentType = res.headers.get('content-type') ?? ''
      const raw = await res.text()
      const truncated = raw.slice(0, MAX_CONTENT_BYTES)
      tosContent = contentType.includes('html') ? htmlToText(truncated) : truncated
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out fetching that URL' }, { status: 504, headers })
      }
      return NextResponse.json({ error: 'Could not fetch the URL. Try pasting the text instead.' }, { status: 502, headers })
    }

  } else if (body.tos_text) {
    // ── Use pasted text ───────────────────────────────────────────────────────
    tosContent = body.tos_text.slice(0, MAX_CONTENT_BYTES)
  } else {
    return NextResponse.json({ error: 'Provide either a ToS URL or paste the ToS text' }, { status: 400, headers })
  }

  if (tosContent.length < 100) {
    return NextResponse.json({ error: 'Content too short to analyze. Paste more of the Terms of Service.' }, { status: 400, headers })
  }

  // ── Run Gemini analysis ──────────────────────────────────────────────────────
  let analysis: Awaited<ReturnType<typeof analyzeToSDocument>>
  try {
    analysis = await analyzeToSDocument(tosContent, companyName)
  } catch (err) {
    console.error('[analyze] Gemini error:', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500, headers })
  }

  const riskLevel = scoreToRisk(analysis.transparencyScore)

  // ── Save to DB ───────────────────────────────────────────────────────────────
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })

  let saved: { id: string; delete_token: string }
  try {
    const result = await pool.query<{ id: string; delete_token: string }>(`
      INSERT INTO user_analyses
        (company_name, tos_url, transparency_score, risk_level, red_flags, summary, manipulation_tactics)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, delete_token
    `, [
      companyName,
      tosUrl,
      analysis.transparencyScore,
      riskLevel,
      JSON.stringify(analysis.redFlags),
      analysis.summary,
      analysis.redFlags.map(f => f.clause).slice(0, 10),
    ])
    saved = result.rows[0]
  } catch (err) {
    console.error('[analyze] DB error:', err)
    return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500, headers })
  } finally {
    await pool.end()
  }

  return NextResponse.json({
    id: saved.id,
    delete_token: saved.delete_token,
    company_name: companyName,
    tos_url: tosUrl,
    transparency_score: analysis.transparencyScore,
    risk_level: riskLevel,
    red_flags: analysis.redFlags,
    summary: analysis.summary,
  }, { headers })
}
