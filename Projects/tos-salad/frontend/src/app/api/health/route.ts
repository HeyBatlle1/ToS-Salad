import { NextResponse } from 'next/server'
import { securityHeaders } from '@/lib/security'

export async function GET() {
  const headers = securityHeaders()
  try {
    const { testConnection } = await import('@/lib/database')
    const healthy = await testConnection()
    return NextResponse.json(
      { status: healthy ? 'ok' : 'degraded', ts: new Date().toISOString() },
      { status: healthy ? 200 : 503, headers }
    )
  } catch {
    // Never expose internal error details publicly
    return NextResponse.json(
      { status: 'error', ts: new Date().toISOString() },
      { status: 500, headers }
    )
  }
}
