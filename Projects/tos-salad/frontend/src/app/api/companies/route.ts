import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { companyApi } = await import('@/lib/database')
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get('domain')

    if (domain) {
      const company = await companyApi.getByDomain(domain)
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 })
      }
      return NextResponse.json({ company, analysis: company.latestAnalysis })
    }

    const companies = await companyApi.getAll()
    return NextResponse.json({ companies })

  } catch (error) {
    console.error('Companies API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
