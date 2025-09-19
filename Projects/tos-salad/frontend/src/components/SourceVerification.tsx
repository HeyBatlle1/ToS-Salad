'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface SourceVerificationProps {
  url: string
  analysisId?: number
  className?: string
}

interface VerificationStatus {
  accessible: boolean
  status?: number
  error?: string
  lastChecked: string
}

export function SourceVerification({ url, analysisId, className }: SourceVerificationProps) {
  const [verification, setVerification] = useState<VerificationStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkUrl = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // First try to get cached verification from analysis API
      if (analysisId) {
        const response = await fetch(`/api/analysis/${analysisId}`)
        const data = await response.json()
        
        if (response.ok && data.analysis?.sourceVerification) {
          setVerification(data.analysis.sourceVerification)
          setIsLoading(false)
          return
        }
      }

      // Fallback: check URL directly (client-side approach)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      try {
        const response = await fetch('/api/verify-source', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        const result = await response.json()
        
        if (response.ok) {
          setVerification(result.verification)
        } else {
          throw new Error(result.error || 'Verification failed')
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          setVerification({
            accessible: false,
            error: 'Request timeout',
            lastChecked: new Date().toISOString()
          })
        } else {
          throw fetchError
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      setVerification({
        accessible: false,
        error: errorMessage,
        lastChecked: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkUrl()
  }, [url, analysisId])

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="animate-spin text-blue-500" size={16} />
    }
    
    if (!verification) {
      return <AlertCircle className="text-gray-400" size={16} />
    }

    if (verification.accessible) {
      return <CheckCircle className="text-green-500" size={16} />
    }

    return <XCircle className="text-red-500" size={16} />
  }

  const getStatusText = () => {
    if (isLoading) return 'Verifying source...'
    
    if (!verification) return 'Unknown status'
    
    if (verification.accessible) {
      return `Source accessible${verification.status ? ` (${verification.status})` : ''}`
    }
    
    return `Source unavailable${verification.error ? `: ${verification.error}` : ''}`
  }

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-600 bg-blue-50'
    
    if (!verification) return 'text-gray-600 bg-gray-50'
    
    if (verification.accessible) {
      return 'text-green-700 bg-green-50'
    }
    
    return 'text-red-700 bg-red-50'
  }

  return (
    <div className={cn('border border-gray-200 rounded-lg p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            Source Verification
          </h4>
          <p className="text-xs text-gray-600">
            Checking if the original document is still accessible
          </p>
        </div>
        
        <button
          onClick={checkUrl}
          disabled={isLoading}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          title="Refresh verification status"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className={cn(
        'flex items-center gap-2 p-2 rounded-md text-sm',
        getStatusColor()
      )}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {verification?.lastChecked && (
        <p className="text-xs text-gray-500 mt-2">
          Last checked: {formatDate(verification.lastChecked)}
        </p>
      )}

      {/* Source URL */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-1">Original source:</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 break-all"
        >
          <ExternalLink size={12} className="flex-shrink-0" />
          {url}
        </a>
      </div>

      {/* Error Details */}
      {error && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-red-600">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Help Text */}
      {verification && !verification.accessible && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600">
            <strong>Why this matters:</strong> When source documents become inaccessible, 
            it may indicate the company has changed their terms or removed transparency. 
            Our analysis is based on the document as it existed at the time of analysis.
          </p>
        </div>
      )}
    </div>
  )
}