import { NextRequest, NextResponse } from 'next/server'
import { serverAnalysisApi } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = parseInt(params.id)
    
    if (isNaN(analysisId)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID' },
        { status: 400 }
      )
    }

    const analysis = await serverAnalysisApi.getById(analysisId)

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Verify source URLs are still accessible
    const document = analysis.document
    if (document?.url) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch(document.url, { 
          method: 'HEAD',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        analysis.sourceVerification = {
          url: document.url,
          accessible: response.ok,
          status: response.status,
          lastChecked: new Date().toISOString()
        }
      } catch (error) {
        analysis.sourceVerification = {
          url: document.url,
          accessible: false,
          error: 'Connection failed',
          lastChecked: new Date().toISOString()
        }
      }
    }

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}