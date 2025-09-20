'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar, AlertTriangle, Shield, Eye } from 'lucide-react'
import { TransparencyScore } from '@/components/companies/TransparencyScore'
import { RedFlagsList } from '@/components/companies/RedFlagsList'
import { SourceVerification } from '@/components/SourceVerification'
import { cn, getTransparencyColor, formatDate } from '@/lib/utils'
import type { Company, AnalysisResult } from '@/lib/supabase'

interface CompanyDetailPageProps {
  params: {
    domain: string
  }
}

interface CompanyWithAnalysis extends Company {
  latestAnalysis: AnalysisResult | null
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const resolvedParams = await params
  return <CompanyDetailContent domain={resolvedParams.domain} />
}

function CompanyDetailContent({ domain }: { domain: string }) {
  const [company, setCompany] = useState<CompanyWithAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompanyData()
  }, [domain])

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`/api/companies?domain=${encodeURIComponent(domain)}`)
      const data = await response.json()
      
      if (response.ok) {
        setCompany({
          ...data.company,
          latestAnalysis: data.analysis
        })
      } else if (response.status === 404) {
        notFound()
      } else {
        throw new Error(data.error || 'Failed to fetch company data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested company could not be found in our database.'}</p>
          <Link 
            href="/companies"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            <ArrowLeft size={16} />
            Back to Companies
          </Link>
        </div>
      </div>
    )
  }

  const analysis = company.latestAnalysis
  const transparencyScore = analysis?.transparency_score ?? null
  const redFlags = analysis?.red_flags || []
  const highSeverityFlags = redFlags.filter(flag => flag.severity === 'high')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/companies"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Companies
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {company.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <ExternalLink size={16} />
                <a 
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600"
                >
                  {company.domain}
                </a>
              </div>
              {company.industry && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                  {company.industry}
                </span>
              )}
              {analysis && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>Analyzed {formatDate(analysis.analyzed_at)}</span>
                </div>
              )}
            </div>
          </div>
          
          {transparencyScore !== null && (
            <div className="flex items-center gap-4">
              <TransparencyScore score={transparencyScore} size="lg" />
            </div>
          )}
        </div>
      </div>

      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Quote-and-Explain Analysis */}
            {analysis.full_analysis && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Complete Analysis</h2>
                <div className="prose prose-gray max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans text-sm">{analysis.full_analysis}</pre>
                </div>
              </div>
            )}

            {/* Executive Summary */}
            {analysis.executive_summary && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Executive Summary</h2>
                <p className="text-gray-700 leading-relaxed">{analysis.executive_summary}</p>
              </div>
            )}

            {/* Red Flags */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Red Flags Analysis</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span>{redFlags.length} issues found</span>
                  </div>
                </div>
              </div>
              <RedFlagsList redFlags={redFlags} />
            </div>

            {/* Key Concerns */}
            {analysis.key_concerns && analysis.key_concerns.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Concerns</h2>
                <ul className="space-y-2">
                  {analysis.key_concerns.map((concern: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transparency Score</span>
                  <span className={cn(
                    'font-bold text-lg',
                    transparencyScore !== null ? getTransparencyColor(transparencyScore).split(' ')[0] : 'text-gray-400'
                  )}>
                    {transparencyScore !== null ? `${transparencyScore}/100` : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Red Flags</span>
                  <span className="font-bold text-red-600">{redFlags.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Severity</span>
                  <span className="font-bold text-red-700">{highSeverityFlags.length}</span>
                </div>
                
                {analysis.privacy_score !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Privacy Score</span>
                    <span className="font-bold text-blue-600">{analysis.privacy_score}/100</span>
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Domain:</span>
                  <span className="ml-2 font-medium">{company.domain}</span>
                </div>
                
                {company.industry && (
                  <div>
                    <span className="text-gray-600">Industry:</span>
                    <span className="ml-2 font-medium">{company.industry}</span>
                  </div>
                )}
                
                {company.headquarters && (
                  <div>
                    <span className="text-gray-600">Headquarters:</span>
                    <span className="ml-2 font-medium">{company.headquarters}</span>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-medium">{formatDate(company.updated_at)}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a
                  href={`https://${company.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 text-sm font-medium transition-colors"
                >
                  <ExternalLink size={16} />
                  Visit Website
                </a>
              </div>
            </div>

            {/* Source Verification */}
            <SourceVerification 
              domain={company.domain}
              lastAnalyzed={analysis.analyzed_at}
            />
          </div>
        </div>
      ) : (
        /* No Analysis Available */
        <div className="text-center py-16">
          <Eye className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Pending</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            This company is in our database but hasn't been analyzed yet. Our AI system will analyze their Terms of Service soon.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/companies"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              <ArrowLeft size={16} />
              Back to Companies
            </Link>
            <a
              href={`https://${company.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              <ExternalLink size={16} />
              Visit {company.name}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}