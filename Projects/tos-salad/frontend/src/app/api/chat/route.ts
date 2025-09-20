import { NextRequest, NextResponse } from 'next/server'
import { generateChatResponse, checkRateLimit } from '@/lib/gemini'
import { serverCompanyApi, serverAnalysisApi } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

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
      serverCompanyApi.getAll().catch(() => []),
      serverAnalysisApi.getAllResults().catch(() => [])
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