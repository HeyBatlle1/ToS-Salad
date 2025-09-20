'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getBestFaviconUrl, getFaviconSources } from '@/lib/favicon'

interface CompanyFaviconProps {
  domain: string
  companyName: string
  size?: number
  className?: string
}

export function CompanyFavicon({
  domain,
  companyName,
  size = 32,
  className
}: CompanyFaviconProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  // Get favicon sources for fallback
  const faviconSources = getFaviconSources(domain, size)
  const primaryFaviconUrl = getBestFaviconUrl(domain, size)

  const handleImageError = () => {
    // Try next favicon source
    if (currentSourceIndex < faviconSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1)
    } else {
      // All sources failed, show fallback
      setHasError(true)
    }
  }

  const handleImageLoad = () => {
    setHasError(false)
  }

  if (hasError) {
    // Fallback to company initial
    return (
      <div
        className={cn(
          'flex items-center justify-center font-bold text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span style={{ fontSize: Math.max(size * 0.4, 12) }}>
          {companyName.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  const currentFaviconUrl = currentSourceIndex === 0
    ? primaryFaviconUrl
    : faviconSources[currentSourceIndex]?.url || primaryFaviconUrl

  return (
    <div
      className={cn('overflow-hidden rounded-lg shadow-sm bg-white border border-gray-100', className)}
      style={{ width: size, height: size }}
    >
      <img
        src={currentFaviconUrl}
        alt={`${companyName} favicon`}
        width={size}
        height={size}
        className="w-full h-full object-contain"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          imageRendering: 'crisp-edges',
          filter: 'contrast(1.1) saturate(1.1)'
        }}
      />
    </div>
  )
}