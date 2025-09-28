import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/database'

export async function GET() {
  try {
    const dbHealthy = await testConnection()

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'connected' : 'disconnected',
        api: 'running'
      },
      environment: process.env.NODE_ENV || 'unknown'
    }

    return NextResponse.json(health, {
      status: dbHealthy ? 200 : 503
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          database: 'error',
          api: 'running'
        }
      },
      { status: 500 }
    )
  }
}