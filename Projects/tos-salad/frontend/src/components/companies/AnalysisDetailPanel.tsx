'use client'

import { useState } from 'react'
import { MessageSquare, BookOpen, X } from 'lucide-react'
import { SlideOutPanel } from '@/components/ui/SlideOutPanel'
import { RedFlagsList } from '@/components/companies/RedFlagsList'
import { cn, formatDate } from '@/lib/utils'
import type { AnalysisResult } from '@/lib/supabase'

interface AnalysisDetailPanelProps {
  isOpen: boolean
  onClose: () => void
  analysis: AnalysisResult
  companyName: string
  companyDomain: string
}

export function AnalysisDetailPanel({
  isOpen,
  onClose,
  analysis,
  companyName,
  companyDomain
}: AnalysisDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis'>('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'analysis', label: 'Full Analysis', icon: MessageSquare }
  ]

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={`${companyName} Analysis`}
      size="xl"
    >
      {/* Company Header - Keep this minimal */}
      <div className="bg-gray-50 -m-6 mb-6 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{companyName}</h3>
            <div className="text-sm text-gray-500">
              {companyDomain} • Analyzed {formatDate(analysis.analyzed_at)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {analysis.transparency_score}/100
            </div>
            <div className="text-xs text-gray-500">Transparency Score</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 -mx-6 px-6 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary - PRESERVE AS IS */}
            {analysis.executive_summary && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h4>
                <p className="text-gray-700 leading-relaxed">{analysis.executive_summary}</p>
              </div>
            )}

            {/* Key Concerns - PRESERVE AS IS */}
            {analysis.key_concerns && analysis.key_concerns.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Concerns</h4>
                <ul className="space-y-2">
                  {analysis.key_concerns.map((concern: string, index: number) => (
                    <li key={index} className="text-gray-700">• {concern}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations - PRESERVE AS IS */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="text-gray-700">• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Simple Discuss Button */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mt-6">
              <MessageSquare size={16} />
              Discuss This Analysis with Agent
            </button>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            {/* Use existing RedFlagsList component - PRESERVE ANALYSIS FORMAT */}
            <RedFlagsList redFlags={analysis.red_flags || []} />

            {/* Simple Discuss Button */}
            <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mt-6">
              <MessageSquare size={16} />
              Ask Agent About These Red Flags
            </button>
          </div>
        )}
      </div>
    </SlideOutPanel>
  )
}