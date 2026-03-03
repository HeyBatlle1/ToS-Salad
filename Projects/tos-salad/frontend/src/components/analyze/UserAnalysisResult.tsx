'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Share2, Trash2, Send, CheckCircle, AlertTriangle, Shield,
  ExternalLink, ChevronDown, ChevronUp, Copy, Check,
} from 'lucide-react'

interface RedFlag {
  clause: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
  sourceSection?: string
}

interface UserAnalysis {
  id: string
  company_name: string
  tos_url?: string
  transparency_score: number
  risk_level: string
  red_flags: RedFlag[]
  summary: string
  status: string
  created_at: string
}

interface UserAnalysisResultProps {
  analysis: UserAnalysis
}

const SCORE_CONFIG = {
  high:   { min: 7, label: 'Transparent',  bg: 'bg-green-100',  text: 'text-green-800',  ring: 'ring-green-400',  bar: 'bg-green-500'  },
  medium: { min: 4, label: 'Concerning',   bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-400', bar: 'bg-yellow-500' },
  low:    { min: 0, label: 'Predatory',    bg: 'bg-red-100',    text: 'text-red-800',    ring: 'ring-red-400',    bar: 'bg-red-500'    },
}

const SEVERITY_CONFIG = {
  high:   { bg: 'bg-red-50',    border: 'border-red-300',    badge: 'bg-red-100 text-red-800',    icon: '🚨' },
  medium: { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-800', icon: '⚠️' },
  low:    { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800', icon: '📌' },
}

function scoreConfig(score: number) {
  if (score >= 7) return SCORE_CONFIG.high
  if (score >= 4) return SCORE_CONFIG.medium
  return SCORE_CONFIG.low
}

export function UserAnalysisResult({ analysis }: UserAnalysisResultProps) {
  const router = useRouter()
  const [isOwner, setIsOwner] = useState(false)
  const [deleteToken, setDeleteToken] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [copied, setCopied] = useState(false)
  const [deleteState, setDeleteState] = useState<'idle' | 'confirming' | 'loading' | 'done'>('idle')
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  const cfg = scoreConfig(analysis.transparency_score)
  const scorePercent = Math.round((analysis.transparency_score / 9) * 100)

  // Check localStorage for ownership
  useEffect(() => {
    try {
      const stored: Array<{ id: string; delete_token: string }> =
        JSON.parse(localStorage.getItem('tos_my_analyses') ?? '[]')
      const mine = stored.find(a => a.id === analysis.id)
      if (mine) {
        setIsOwner(true)
        setDeleteToken(mine.delete_token)
      }
    } catch {}
  }, [analysis.id])

  const handleShare = async () => {
    const url = `${window.location.origin}/analysis/${analysis.id}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleDelete = async () => {
    if (deleteState === 'idle') { setDeleteState('confirming'); return }
    if (!deleteToken) return
    setDeleteState('loading')
    try {
      const res = await fetch(`/api/analyze/${analysis.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delete_token: deleteToken }),
      })
      if (res.ok) {
        // Remove from localStorage
        try {
          const stored: Array<{ id: string; delete_token: string }> =
            JSON.parse(localStorage.getItem('tos_my_analyses') ?? '[]')
          localStorage.setItem('tos_my_analyses', JSON.stringify(stored.filter(a => a.id !== analysis.id)))
        } catch {}
        setDeleteState('done')
        setTimeout(() => router.push('/analyze'), 1500)
      } else {
        setDeleteState('idle')
      }
    } catch {
      setDeleteState('idle')
    }
  }

  const handleSubmit = async () => {
    if (!deleteToken) return
    setSubmitState('loading')
    setSubmitError(null)
    try {
      const res = await fetch(`/api/analyze/${analysis.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delete_token: deleteToken }),
      })
      const data = await res.json()
      if (res.ok) {
        setSubmitState('done')
      } else {
        setSubmitError(data.error ?? 'Submit failed')
        setSubmitState('idle')
      }
    } catch {
      setSubmitError('Network error')
      setSubmitState('idle')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className={`rounded-2xl p-6 ${cfg.bg} ring-2 ${cfg.ring}`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{analysis.company_name}</h1>
            {analysis.tos_url && (
              <a
                href={analysis.tos_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-1"
              >
                <ExternalLink size={13} />
                {analysis.tos_url.length > 60 ? analysis.tos_url.slice(0, 60) + '…' : analysis.tos_url}
              </a>
            )}
          </div>

          {/* Score ring */}
          <div className="flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full ring-4 ${cfg.ring} ${cfg.bg} flex flex-col items-center justify-center`}>
              <span className={`text-2xl font-bold ${cfg.text}`}>{analysis.transparency_score}</span>
              <span className={`text-xs font-medium ${cfg.text}`}>/ 9</span>
            </div>
            <span className={`mt-2 text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Predatory</span>
            <span>Transparent</span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full ${cfg.bar} rounded-full transition-all duration-700`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Risk + red flag count */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}`}>
            {analysis.risk_level} Risk
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70 text-gray-700">
            {analysis.red_flags.length} red flag{analysis.red_flags.length !== 1 ? 's' : ''} found
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            Analyzed {new Date(analysis.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={18} className="text-green-600" />
          <h2 className="font-semibold text-gray-900">Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
      </div>

      {/* Red flags */}
      {analysis.red_flags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            Red Flags Found
          </h2>
          {analysis.red_flags.map((flag, i) => {
            const s = SEVERITY_CONFIG[flag.severity] ?? SEVERITY_CONFIG.low
            return (
              <div key={i} className={`rounded-xl border-2 ${s.border} ${s.bg} overflow-hidden`}>
                <button
                  type="button"
                  onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                  className="w-full flex items-start gap-3 p-4 text-left"
                >
                  <span className="text-lg leading-none mt-0.5">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${s.badge}`}>
                        {flag.severity}
                      </span>
                      {flag.sourceSection && (
                        <span className="text-xs text-gray-500">{flag.sourceSection}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700 italic line-clamp-2">
                      "{flag.clause}"
                    </p>
                  </div>
                  {expanded[i]
                    ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                    : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                  }
                </button>
                {expanded[i] && (
                  <div className="px-4 pb-4 pt-0 border-t border-current/10">
                    <div className="bg-white/80 rounded-lg p-4 mt-2 space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Original Text</p>
                        <p className="text-sm italic text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 leading-relaxed">
                          "{flag.clause}"
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Plain English</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{flag.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:border-green-400 hover:text-green-700 transition-all"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copied ? 'Link Copied!' : 'Share Analysis'}
          </button>

          {/* Submit for review (owner only) */}
          {isOwner && analysis.status !== 'pending_review' && submitState !== 'done' && (
            <button
              onClick={handleSubmit}
              disabled={submitState === 'loading'}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-300 rounded-xl text-sm font-semibold text-blue-700 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-all"
            >
              <Send size={16} />
              {submitState === 'loading' ? 'Submitting…' : 'Add to ToS Salad'}
            </button>
          )}

          {submitState === 'done' && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-2 border-blue-300 rounded-xl text-sm font-semibold text-blue-700">
              <CheckCircle size={16} />
              Submitted for review — thanks!
            </div>
          )}

          {analysis.status === 'pending_review' && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border-2 border-blue-200 rounded-xl text-sm text-blue-700">
              <CheckCircle size={16} />
              Under review
            </div>
          )}

          {/* Delete (owner only) */}
          {isOwner && deleteState !== 'done' && (
            <button
              onClick={handleDelete}
              disabled={deleteState === 'loading'}
              className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                deleteState === 'confirming'
                  ? 'bg-red-50 border-red-400 text-red-700 hover:bg-red-100'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-600'
              }`}
            >
              <Trash2 size={16} />
              {deleteState === 'confirming' ? 'Confirm Delete' : deleteState === 'loading' ? 'Deleting…' : 'Delete'}
            </button>
          )}

          {deleteState === 'done' && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-sm text-gray-500">
              <CheckCircle size={16} />
              Deleted — redirecting…
            </div>
          )}
        </div>

        {submitError && (
          <p className="text-xs text-red-600 mt-2">{submitError}</p>
        )}

        <p className="text-xs text-gray-400 mt-3">
          {isOwner
            ? '"Add to ToS Salad" sends this for curator review. Your analysis may be added to our public database.'
            : 'This analysis was created by a community member. Share the link to spread awareness.'}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-gray-400 pb-4">
        This analysis is AI-generated for educational purposes only. Not legal advice.
        AI can make mistakes — use your judgment and consult a professional for legal decisions.
      </p>
    </div>
  )
}
