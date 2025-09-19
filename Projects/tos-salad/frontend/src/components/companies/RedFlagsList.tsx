'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn, getSeverityColor } from '@/lib/utils'
import type { RedFlag } from '@/lib/supabase'

interface RedFlagsListProps {
  redFlags: RedFlag[]
  sourceUrl?: string
  className?: string
}

export function RedFlagsList({ redFlags, sourceUrl, className }: RedFlagsListProps) {
  const [expandedFlags, setExpandedFlags] = useState<Set<number>>(new Set())
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedFlags)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedFlags(newExpanded)
  }

  const filteredFlags = redFlags.filter(flag => 
    severityFilter === 'all' || flag.severity === severityFilter
  )

  const severityCounts = redFlags.reduce((acc, flag) => {
    acc[flag.severity] = (acc[flag.severity] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (redFlags.length === 0) {
    return (
      <div className={cn('text-center py-8 bg-green-50 rounded-lg', className)}>
        <AlertTriangle className="mx-auto h-12 w-12 text-green-400 mb-3" />
        <p className="text-green-800 font-medium">No red flags detected</p>
        <p className="text-green-600 text-sm">This company appears to have fair terms</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">
            Red Flags ({filteredFlags.length})
          </h3>
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
          >
            <ExternalLink size={14} />
            View Source
          </a>
        )}
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setSeverityFilter('all')}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            severityFilter === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          All ({redFlags.length})
        </button>
        {(['high', 'medium', 'low'] as const).map(severity => (
          <button
            key={severity}
            onClick={() => setSeverityFilter(severity)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize',
              severityFilter === severity
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {severity} ({severityCounts[severity] || 0})
          </button>
        ))}
      </div>

      {/* Red Flags List */}
      <div className="space-y-3">
        {filteredFlags.map((flag, index) => {
          const isExpanded = expandedFlags.has(index)
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Flag Header */}
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide',
                        getSeverityColor(flag.severity)
                      )}>
                        {flag.severity}
                      </span>
                      {flag.source_section && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {flag.source_section}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {flag.explanation}
                    </p>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <div className="pt-3 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Why this is concerning:
                      </h4>
                      <p className="text-sm text-gray-700">
                        {flag.explanation}
                      </p>
                    </div>
                    
                    {flag.clause && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          Problematic clause:
                        </h4>
                        <div className="bg-white border border-gray-200 rounded p-3">
                          <p className="text-sm text-gray-800 italic">
                            "{flag.clause}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filteredFlags.length === 0 && severityFilter !== 'all' && (
        <div className="text-center py-6 text-gray-500">
          <p>No {severityFilter} severity flags found</p>
        </div>
      )}
    </div>
  )
}