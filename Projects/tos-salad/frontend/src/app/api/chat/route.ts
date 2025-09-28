import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check environment variables
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact administrator.' },
        { status: 503 }
      )
    }

    // Dynamic imports to prevent build-time crashes
    const [{ generateChatResponse, checkRateLimit }, { companyApi, analysisApi }] = await Promise.all([
      import('@/lib/gemini'),
      import('@/lib/database')
    ])

    // Rate limiting by IP (simplified for now)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Get context data for better responses
    const [companies, analyses] = await Promise.all([
      companyApi.getAll().catch(() => []),
      analysisApi.getAllResults().catch(() => [])
    ])

    const response = await generateChatResponse(message, { companies, analyses })

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API error:', error)

    // Always return JSON, never HTML error pages
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Chat error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    )
  }
}