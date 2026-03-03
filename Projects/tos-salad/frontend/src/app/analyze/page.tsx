import { AnalyzeForm } from '@/components/analyze/AnalyzeForm'
import { Search, Zap, Shield, Clock } from 'lucide-react'

export const metadata = {
  title: 'Analyze Terms of Service — ToS Salad',
  description: 'Paste a ToS URL or text and get an instant AI-powered transparency analysis with red flags, plain-English explanations, and a transparency score.',
}

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Analyze Any Terms of Service
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Paste a URL or the ToS text. We'll score it, find the red flags, and
            explain everything in plain English.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Zap, label: '15–30 sec', desc: 'Typical analysis time' },
            { icon: Shield, label: 'Score 1–9', desc: 'Transparency rating' },
            { icon: Clock, label: '5 / hour', desc: 'Free analyses' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <Icon size={18} className="text-green-600 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <AnalyzeForm />
        </div>

        {/* Methodology note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>How it works:</strong> Our AI uses the quote-and-explain methodology — it extracts
          exact clauses from the document and explains in plain English what each one means for you.
          Scores are 1–9 (1 = predatory, 9 = fully transparent). We use Signal as our benchmark for
          what user-friendly terms actually look like.
        </div>
      </div>
    </div>
  )
}
