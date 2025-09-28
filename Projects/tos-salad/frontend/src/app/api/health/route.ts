import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables first without crashing
    const envStatus = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
      GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY ? 'Set' : 'Missing',
      NODE_ENV: process.env.NODE_ENV || 'unknown',
      NETLIFY: process.env.NETLIFY || 'false'
    }

    // Only try database connection if env vars are present
    let dbStatus = 'not-tested'
    if (envStatus.DATABASE_URL === 'Set') {
      try {
        // Dynamic import to avoid early validation crash
        const { testConnection } = await import('@/lib/database')
        const dbHealthy = await testConnection()
        dbStatus = dbHealthy ? 'connected' : 'disconnected'
      } catch (dbError) {
        dbStatus = `error: ${dbError instanceof Error ? dbError.message : 'Unknown DB error'}`
      }
    } else {
      dbStatus = 'env-missing'
    }

    const health = {
      status: dbStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        api: 'running'
      },
      environment: envStatus
    }

    return NextResponse.json(health, {
      status: dbStatus === 'connected' ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack?.substring(0, 500) : undefined,
        services: {
          database: 'error',
          api: 'running'
        }
      },
      { status: 500 }
    )
  }
}