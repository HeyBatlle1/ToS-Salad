'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Link, FileText, AlertCircle, Loader2, ArrowRight } from 'lucide-react'

type InputMode = 'url' | 'text'

export function AnalyzeForm() {
  const router = useRouter()
  const [mode, setMode] = useState<InputMode>('url')
  const [companyName, setCompanyName] = useState('')
  const [tosUrl, setTosUrl] = useState('')
  const [tosText, setTosText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = companyName.trim().length > 0 &&
    (mode === 'url' ? tosUrl.trim().length > 0 : tosText.trim().length > 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setError(null)

    try {
      const body: Record<string, string> = { company_name: companyName.trim() }
      if (mode === 'url') body.tos_url = tosUrl.trim()
      else body.tos_text = tosText.trim()

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Analysis failed. Please try again.')
        return
      }

      // Store ownership in localStorage so delete/submit buttons appear
      try {
        const stored = JSON.parse(localStorage.getItem('tos_my_analyses') ?? '[]')
        stored.push({ id: data.id, delete_token: data.delete_token })
        localStorage.setItem('tos_my_analyses', JSON.stringify(stored.slice(-50)))
      } catch {}

      router.push(`/analysis/${data.id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="e.g. Spotify, Twitter, your bank..."
          maxLength={200}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 font-medium transition-all"
          disabled={loading}
        />
      </div>

      {/* Mode toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          How do you want to provide the Terms of Service?
        </label>
        <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all ${
              mode === 'url'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Link size={16} />
            Paste a URL
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-l-2 border-gray-200 ${
              mode === 'text'
                ? 'bg-green-600 text-white border-l-green-600'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={16} />
            Paste the text
          </button>
        </div>
      </div>

      {/* URL or text input */}
      {mode === 'url' ? (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            ToS / Privacy Policy URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={tosUrl}
            onChange={e => setTosUrl(e.target.value)}
            placeholder="https://example.com/terms"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 font-medium transition-all"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            We'll fetch the page and analyze the text. Some sites block automated access — if it fails, paste the text instead.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Terms of Service text <span className="text-red-500">*</span>
          </label>
          <textarea
            value={tosText}
            onChange={e => setTosText(e.target.value)}
            placeholder="Paste the Terms of Service text here. The more complete, the better the analysis..."
            rows={12}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 font-medium transition-all resize-y"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            {tosText.length.toLocaleString()} characters pasted
            {tosText.length < 100 && tosText.length > 0 && (
              <span className="text-orange-600 ml-2">— need at least 100 characters</span>
            )}
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-lg transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Analyzing — this takes 15–30 seconds...
          </>
        ) : (
          <>
            <Search size={20} />
            Analyze Terms of Service
            <ArrowRight size={20} />
          </>
        )}
      </button>

      <p className="text-xs text-center text-gray-500">
        Analysis runs on Gemini AI and is saved for sharing. You'll be able to delete it after.
        Results are for educational purposes — not legal advice.
      </p>
    </form>
  )
}
