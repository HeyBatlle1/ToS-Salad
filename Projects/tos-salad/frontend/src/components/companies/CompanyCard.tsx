'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, ExternalLink, Calendar, Shield, Eye } from 'lucide-react'
import { cn, getTransparencyColor, getSeverityColor, formatDate } from '@/lib/utils'
import { AnalysisDetailPanel } from '@/components/companies/AnalysisDetailPanel'
import { CompanyFavicon } from '@/components/ui/CompanyFavicon'
import type { Company, AnalysisResult } from '@/lib/supabase'

interface CompanyCardProps {
  company: Company & { latestAnalysis?: AnalysisResult | null }
  className?: string
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false)
  const analysis = company.latestAnalysis
  const transparencyScore = analysis?.transparency_score ?? null
  const redFlagCount = analysis?.red_flags?.length ?? 0
  const highSeverityFlags = analysis?.red_flags?.filter(flag => flag.severity === 'high')?.length ?? 0

  return (
    <div className={cn(
      'bg-white rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 mb-8 overflow-hidden',
      'ring-1 ring-gray-100/50 hover:ring-gray-200/50 min-h-[500px] flex flex-col',
      className
    )}>
      {/* Company Branding Header with Fixed Layout */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 relative">
        <div className="p-8">
          {/* Top Row: Logo positioned top-left, Score positioned top-right */}
          <div className="flex items-start justify-between mb-6">
            {/* Company Favicon - Top Left */}
            <div className="flex-shrink-0">
              <CompanyFavicon
                domain={company.domain}
                companyName={company.name}
                size={72}
                className="ring-2 ring-gray-100 shadow-lg"
              />
            </div>

            {/* Enhanced Transparency Score Badge - Top Right */}
            {transparencyScore !== null && (
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  'w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black shadow-2xl border-4 relative',
                  transparencyScore >= 61 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300 shadow-green-200' :
                  transparencyScore >= 31 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-yellow-300 shadow-yellow-200' :
                  'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-300 shadow-red-200'
                )}>
                  <div className="absolute inset-0 rounded-full bg-white/20"></div>
                  <span className="relative z-10">{transparencyScore}</span>
                </div>
                <div className="flex flex-col items-center mt-3 space-y-1">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transparency Score</span>
                  <span className={cn(
                    'text-sm font-black uppercase tracking-wide px-3 py-1 rounded-full',
                    transparencyScore >= 61 ? 'text-green-700 bg-green-100' :
                    transparencyScore >= 31 ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100'
                  )}>
                    {transparencyScore >= 61 ? 'TRUSTWORTHY' :
                     transparencyScore >= 31 ? 'CONCERNING' :
                     'HIGH RISK'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Company Information with Clear Spacing */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {company.name}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                {company.domain}
              </span>
              {company.industry && (
                <span className="capitalize text-gray-600 bg-blue-50 px-4 py-2 rounded-full text-sm font-medium">
                  {company.industry}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Proper Visual Zones */}
      <div className="p-8 flex-1 flex flex-col">

        {/* Analysis Summary Zone */}
        {analysis ? (
          <div className="space-y-6 flex-1">
            {/* Key Metrics Block - Enhanced Spacing */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle
                    size={20}
                    className={highSeverityFlags > 0 ? 'text-red-500' : 'text-yellow-500'}
                  />
                  <div>
                    <div className="text-base font-semibold text-gray-900 mb-1">
                      {redFlagCount} Red Flag{redFlagCount !== 1 ? 's' : ''} Found
                    </div>
                    {highSeverityFlags > 0 && (
                      <div className="text-sm text-red-600 font-medium">
                        {highSeverityFlags} High Severity Issues
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Calendar size={14} />
                  {formatDate(analysis.analyzed_at)}
                </div>
              </div>
            </div>

            {/* Top Issues Preview - Enhanced Spacing */}
            {analysis.red_flags && analysis.red_flags.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Top Concerns</h4>
                <div className="space-y-4">
                  {analysis.red_flags.slice(0, 2).map((flag, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 rounded-xl p-5 bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className={cn(
                          'px-3 py-2 rounded-lg text-sm font-bold uppercase tracking-wide',
                          getSeverityColor(flag.severity)
                        )}>
                          {flag.severity} risk
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {flag.explanation}
                      </p>
                    </div>
                  ))}

                  {analysis.red_flags.length > 2 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                        +{analysis.red_flags.length - 2} more issues discovered
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 flex-1 flex items-center justify-center">
            <div>
              <Shield className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-base text-gray-500 mb-3 font-medium">No analysis available</p>
              <p className="text-sm text-gray-400">
                This company hasn't been analyzed yet
              </p>
            </div>
          </div>
        )}

        {/* Actions Zone - Separated and Fixed */}
        <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          {analysis && (
            <>
              <button
                onClick={() => setShowAnalysisPanel(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-4 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                <Eye size={16} />
                Quick Analysis
              </button>
              <Link
                href={`/companies/${company.domain}`}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-4 px-6 rounded-xl text-sm font-semibold flex items-center justify-center shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                Full Report
              </Link>
            </>
          )}

          <a
            href={`https://${company.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 text-gray-700 text-sm border-2 border-gray-300 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            <ExternalLink size={16} />
            Visit Site
          </a>
        </div>
      </div>

      {/* Analysis Detail Panel - PRESERVES original analysis format */}
      {analysis && (
        <AnalysisDetailPanel
          isOpen={showAnalysisPanel}
          onClose={() => setShowAnalysisPanel(false)}
          analysis={analysis}
          companyName={company.name}
          companyDomain={company.domain}
        />
      )}
    </div>
  )
}