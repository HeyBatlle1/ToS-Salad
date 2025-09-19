import { NextRequest, NextResponse } from 'next/server'
import { serverCompanyApi, serverAnalysisApi } from '@/lib/supabase-server'

// Cache for company data
let cachedData: { companies: any[], timestamp: number } | null = null
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600') * 1000

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')

    // If requesting specific company by domain
    if (domain) {
      const company = await serverCompanyApi.getByDomain(domain)
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }

      const analysis = await serverAnalysisApi.getLatestForCompany(company.id)
      return NextResponse.json({ 
        company, 
        analysis: analysis || null 
      })
    }

    // Check cache for all companies
    const now = Date.now()
    if (cachedData && (now - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json({ companies: cachedData.companies })
    }

    // Fetch fresh data
    const companies = await serverCompanyApi.getAll()
    
    // Get latest analysis for each company
    const companiesWithAnalysis = await Promise.all(
      companies.map(async (company) => {
        try {
          const analysis = await serverAnalysisApi.getLatestForCompany(company.id)
          return { ...company, latestAnalysis: analysis }
        } catch (error) {
          console.error(`Failed to get analysis for company ${company.id}:`, error)
          return { ...company, latestAnalysis: null }
        }
      })
    )

    // Update cache
    cachedData = {
      companies: companiesWithAnalysis,
      timestamp: now
    }

    return NextResponse.json({ companies: companiesWithAnalysis })

  } catch (error) {
    console.error('Companies API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}