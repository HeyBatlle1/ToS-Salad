import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({
        verification: {
          accessible: false,
          error: 'Invalid URL format',
          lastChecked: new Date().toISOString()
        }
      })
    }

    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json({
        verification: {
          accessible: false,
          error: 'Only HTTP/HTTPS URLs are supported',
          lastChecked: new Date().toISOString()
        }
      })
    }

    // Perform HEAD request to check accessibility
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'ToS-Salad-Bot/1.0 (Source Verification)',
          'Accept': '*/*'
        },
        // Follow redirects but limit to 5
        redirect: 'follow'
      })

      clearTimeout(timeoutId)

      return NextResponse.json({
        verification: {
          accessible: response.ok,
          status: response.status,
          lastChecked: new Date().toISOString()
        }
      })

    } catch (error) {
      clearTimeout(timeoutId)
      
      let errorMessage = 'Connection failed'
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Request timeout'
        } else if (error.message.includes('ENOTFOUND')) {
          errorMessage = 'Domain not found'
        } else if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Connection refused'
        } else if (error.message.includes('SSL')) {
          errorMessage = 'SSL/Certificate error'
        } else {
          errorMessage = error.message
        }
      }

      return NextResponse.json({
        verification: {
          accessible: false,
          error: errorMessage,
          lastChecked: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Source verification API error:', error)
    return NextResponse.json(
      { error: 'Failed to verify source' },
      { status: 500 }
    )
  }
}