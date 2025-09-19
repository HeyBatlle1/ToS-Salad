'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, TrendingDown, AlertCircle } from 'lucide-react'
import { CompanyCard } from '@/components/companies/CompanyCard'
import type { Company, AnalysisResult } from '@/lib/supabase'

interface CompanyWithAnalysis extends Company {
  latestAnalysis?: AnalysisResult | null
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'transparency' | 'redFlags' | 'recent'>('transparency')
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      
      if (response.ok) {
        setCompanies(data.companies || [])
      } else {
        throw new Error(data.error || 'Failed to fetch companies')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedCompanies = companies
    .filter(company => {
      const matchesSearch = 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (!matchesSearch) return false
      
      if (filterSeverity === 'all') return true
      
      const hasMatchingSeverity = company.latestAnalysis?.red_flags?.some(
        flag => flag.severity === filterSeverity
      )
      return hasMatchingSeverity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        
        case 'transparency':
          const aScore = a.latestAnalysis?.transparency_score ?? -1
          const bScore = b.latestAnalysis?.transparency_score ?? -1
          return bScore - aScore // Higher scores first
        
        case 'redFlags':
          const aFlags = a.latestAnalysis?.red_flags?.length ?? 0
          const bFlags = b.latestAnalysis?.red_flags?.length ?? 0
          return bFlags - aFlags // More red flags first
        
        case 'recent':
          const aDate = a.latestAnalysis?.analyzed_at ?? a.updated_at
          const bDate = b.latestAnalysis?.analyzed_at ?? b.updated_at
          return new Date(bDate).getTime() - new Date(aDate).getTime()
        
        default:
          return 0
      }
    })

  const stats = {
    total: companies.length,
    analyzed: companies.filter(c => c.latestAnalysis).length,
    averageScore: companies.filter(c => c.latestAnalysis).length > 0 
      ? Math.round(
          companies
            .filter(c => c.latestAnalysis?.transparency_score)
            .reduce((sum, c) => sum + (c.latestAnalysis!.transparency_score || 0), 0) /
          companies.filter(c => c.latestAnalysis?.transparency_score).length
        )
      : 0,
    totalRedFlags: companies.reduce(
      (sum, c) => sum + (c.latestAnalysis?.red_flags?.length || 0), 
      0
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading company data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchCompanies}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Company Transparency Reports
        </h1>
        <p className="text-lg text-gray-600">
          Explore our analysis of Terms of Service across {stats.total} companies.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Companies Tracked</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">{stats.analyzed}</div>
          <div className="text-sm text-gray-600">Fully Analyzed</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-blue-600">{stats.averageScore}</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">{stats.totalRedFlags}</div>
          <div className="text-sm text-gray-600">Red Flags Found</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies, domains, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="transparency">Transparency Score</option>
              <option value="redFlags">Red Flags</option>
              <option value="name">Name</option>
              <option value="recent">Recently Updated</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Severities</option>
              <option value="high">High Severity</option>
              <option value="medium">Medium Severity</option>
              <option value="low">Low Severity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedCompanies.length} of {companies.length} companies
        </p>
        
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Companies Grid */}
      {filteredAndSortedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {searchTerm ? (
              <>
                <Search size={48} className="mx-auto mb-4" />
                <p className="text-lg">No companies match your search</p>
                <p className="text-sm">Try different keywords or clear your filters</p>
              </>
            ) : (
              <>
                <AlertCircle size={48} className="mx-auto mb-4" />
                <p className="text-lg">No companies found</p>
                <p className="text-sm">Companies will appear here once analysis is complete</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}