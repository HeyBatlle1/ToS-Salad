import { NextRequest, NextResponse } from 'next/server'
import { companyApi, analysisApi } from '@/lib/database'

// Cache for company data - CLEARED TO FORCE REFRESH
let cachedData: { companies: any[], timestamp: number } | null = null
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '60') * 1000 // Reduced cache time

export async function GET(request: NextRequest) {
  try {
    console.log('Companies API called at:', new Date().toISOString())

    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')

    // If requesting specific company by domain
    if (domain) {
      console.log('Fetching company by domain:', domain)
      const company = await companyApi.getByDomain(domain)
      if (!company) {
        console.log('Company not found for domain:', domain)
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }

      const analysis = await analysisApi.getLatestForCompany(company.id)
      return NextResponse.json({
        company,
        analysis: analysis || null
      })
    }

    // Check cache for all companies - CACHE DISABLED FOR REFRESH
    const now = Date.now()
    // Force cache refresh by setting cachedData to null
    cachedData = null

    console.log('Fetching all companies from database...')
    // Fetch fresh data
    const companies = await companyApi.getAll()
    console.log(`Found ${companies.length} companies in database`)

    // Get latest analysis for each company
    const companiesWithAnalysis = await Promise.all(
      companies.map(async (company) => {
        try {
          const analysis = await analysisApi.getLatestForCompany(company.id)
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

    console.log(`Returning ${companiesWithAnalysis.length} companies with analysis data`)
    return NextResponse.json({ companies: companiesWithAnalysis })

  } catch (error) {
    console.error('Companies API error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? '✓ Set' : '✗ Missing',
        NODE_ENV: process.env.NODE_ENV
      }
    })
    return NextResponse.json(
      {
        error: 'Failed to fetch companies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}