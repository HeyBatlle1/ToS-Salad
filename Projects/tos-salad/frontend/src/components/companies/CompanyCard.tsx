'use client'

import Link from 'next/link'
import { AlertTriangle, ExternalLink, Calendar, Shield } from 'lucide-react'
import { cn, getTransparencyColor, getSeverityColor, formatDate } from '@/lib/utils'
import type { Company, AnalysisResult } from '@/lib/supabase'

interface CompanyCardProps {
  company: Company & { latestAnalysis?: AnalysisResult | null }
  className?: string
}

export function CompanyCard({ company, className }: CompanyCardProps) {
  const analysis = company.latestAnalysis
  const transparencyScore = analysis?.transparency_score ?? null
  const redFlagCount = analysis?.red_flags?.length ?? 0
  const highSeverityFlags = analysis?.red_flags?.filter(flag => flag.severity === 'high')?.length ?? 0

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {company.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{company.domain}</span>
              {company.industry && (
                <>
                  <span>•</span>
                  <span className="capitalize">{company.industry}</span>
                </>
              )}
            </div>
          </div>
          
          {transparencyScore !== null && (
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              getTransparencyColor(transparencyScore)
            )}>
              {transparencyScore}/100
            </div>
          )}
        </div>

        {/* Analysis Summary */}
        {analysis ? (
          <div className="space-y-3">
            {/* Red Flags Summary */}
            {redFlagCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle 
                  size={16} 
                  className={highSeverityFlags > 0 ? 'text-red-500' : 'text-yellow-500'} 
                />
                <span className="text-gray-700">
                  {redFlagCount} red flag{redFlagCount !== 1 ? 's' : ''}
                  {highSeverityFlags > 0 && (
                    <span className="text-red-600 font-medium">
                      {' '}({highSeverityFlags} high severity)
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Top Red Flags Preview */}
            {analysis.red_flags && analysis.red_flags.length > 0 && (
              <div className="space-y-2">
                {analysis.red_flags.slice(0, 2).map((flag, index) => (
                  <div 
                    key={index}
                    className="text-sm bg-gray-50 rounded-md p-3"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide',
                        getSeverityColor(flag.severity)
                      )}>
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
                
                {analysis.red_flags.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{analysis.red_flags.length - 2} more red flags
                  </p>
                )}
              </div>
            )}

            {/* Analysis Date */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={12} />
              <span>Analyzed {formatDate(analysis.analyzed_at)}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-2">No analysis available</p>
            <p className="text-xs text-gray-400">
              This company hasn't been analyzed yet
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {analysis && (
            <Link
              href={`/companies/${company.domain}`}
              className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              View Full Report
            </Link>
          )}
          
          <a
            href={`https://${company.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} />
            Visit Site
          </a>
        </div>
      </div>
    </div>
  )
}