'use client'

import { cn, getTransparencyColor } from '@/lib/utils'
import { Info, TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface TransparencyScoreProps {
  score: number
  previousScore?: number | null
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TransparencyScore({ 
  score, 
  previousScore, 
  showDetails = true, 
  size = 'md',
  className 
}: TransparencyScoreProps) {
  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair' 
    if (score >= 20) return 'Poor'
    return 'Very Poor'
  }

  const getScoreDescription = (score: number): string => {
    if (score >= 80) return 'High transparency with clear, fair terms'
    if (score >= 60) return 'Generally transparent with minor concerns'
    if (score >= 40) return 'Some transparency issues present'
    if (score >= 20) return 'Multiple concerning clauses detected'
    return 'Significant transparency and fairness issues'
  }

  const getTrend = () => {
    if (!previousScore) return null
    const diff = score - previousScore
    if (Math.abs(diff) < 5) return { icon: Minus, label: 'No change', color: 'text-gray-500' }
    if (diff > 0) return { icon: TrendingUp, label: `+${diff} points`, color: 'text-green-600' }
    return { icon: TrendingDown, label: `${diff} points`, color: 'text-red-600' }
  }

  const trend = getTrend()

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Score Display */}
      <div className="text-center">
        <div className={cn(
          'inline-flex items-center justify-center rounded-full font-bold mb-2',
          size === 'sm' ? 'w-16 h-16 text-lg' :
          size === 'lg' ? 'w-32 h-32 text-3xl' : 'w-24 h-24 text-2xl',
          getTransparencyColor(score)
        )}>
          {score}
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {getScoreLabel(score)} Transparency
          </h3>
          {trend && (
            <div className={cn('flex items-center justify-center gap-1 text-sm', trend.color)}>
              <trend.icon size={14} />
              <span>{trend.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            'h-2 transition-all duration-500 ease-out rounded-full',
            score >= 80 ? 'bg-green-600' :
            score >= 60 ? 'bg-yellow-500' :
            score >= 40 ? 'bg-orange-500' : 'bg-red-500'
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      {showDetails && (
        <>
          {/* Description */}
          <p className="text-sm text-gray-600 text-center">
            {getScoreDescription(score)}
          </p>

          {/* Score Breakdown */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How we calculate transparency:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Clear language and readability</li>
                  <li>• Fair terms for consumers</li>
                  <li>• Privacy protection measures</li>
                  <li>• Absence of predatory clauses</li>
                  <li>• Data usage transparency</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}