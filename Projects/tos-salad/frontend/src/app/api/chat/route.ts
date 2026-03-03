import { NextRequest, NextResponse } from 'next/server'
import { getClientIP, checkRateLimit, sanitizeInput, securityHeaders } from '@/lib/security'

export async function POST(request: NextRequest) {
  const headers = securityHeaders()

  try {
    // Block oversized request bodies before parsing
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 4096) {
      return NextResponse.json({ error: 'Request too large.' }, { status: 413, headers })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body.message !== 'string') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers })
    }

    // Sanitize and validate input
    const { safe, blocked, reason } = sanitizeInput(body.message)
    if (blocked) {
      // Return a generic message — don't tell attackers what tripped the filter
      if (reason === 'too_long') {
        return NextResponse.json(
          { error: 'Message is too long. Please keep questions under 800 characters.' },
          { status: 400, headers }
        )
      }
      return NextResponse.json(
        { error: 'Message could not be processed. Please rephrase your question.' },
        { status: 400, headers }
      )
    }

    if (!safe) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400, headers })
    }

    // Rate limiting — serverless-safe, DB-backed
    const ipHash = getClientIP(request)
    const rateLimit = await checkRateLimit(ipHash, 'chat')

    if (!rateLimit.allowed) {
      const resetMins = Math.ceil(rateLimit.resetInMs / 60000)
      return NextResponse.json(
        { error: `You've reached the limit of 15 questions per hour. Reset in ~${resetMins} minutes.` },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': String(Math.ceil(rateLimit.resetInMs / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503, headers })
    }

    const [{ generateChatResponse }, { companyApi }] = await Promise.all([
      import('@/lib/gemini'),
      import('@/lib/database'),
    ])

    const companies = await companyApi.getAllForContext().catch(() => [])
    const response = await generateChatResponse(safe, { companies })

    return NextResponse.json(
      { response },
      {
        headers: {
          ...headers,
          'X-RateLimit-Remaining': String(rateLimit.remaining - 1),
        },
      }
    )

  } catch (error) {
    console.error('Chat API error:', error)
    // Never expose internal errors to the client
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers }
    )
  }
}
