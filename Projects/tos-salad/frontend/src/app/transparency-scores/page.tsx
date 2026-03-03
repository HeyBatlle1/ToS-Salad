import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Transparency Scores Explained — ToS Salad',
  description: 'How our 1–9 transparency scoring system works, what each score means, and how companies earn their ratings.',
}

const SCORES = [
  { range: '8–9', label: 'Transparent', color: 'bg-green-100 text-green-800 border-green-200', bar: 'bg-green-500', example: 'Signal', desc: 'Genuinely user-friendly. Minimal data collection, clear language, no forced arbitration, no perpetual licenses. Sets the standard.' },
  { range: '6–7', label: 'Acceptable', color: 'bg-lime-100 text-lime-800 border-lime-200', bar: 'bg-lime-500', example: 'Anthropic', desc: 'Above average. Some concerning clauses but generally respects user rights. Worth reading before signing up.' },
  { range: '4–5', label: 'Concerning', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', bar: 'bg-yellow-500', example: 'Fathom / Telegram', desc: 'Meaningful problems. Contains clauses that restrict your rights or enable data sharing. Proceed with awareness.' },
  { range: '2–3', label: 'Predatory', color: 'bg-orange-100 text-orange-800 border-orange-200', bar: 'bg-orange-500', example: 'Reddit / Wells Fargo', desc: 'Significant consumer harm. Multiple clauses that work against your interests. Consider alternatives.' },
  { range: '1',   label: 'Exploitative', color: 'bg-red-100 text-red-800 border-red-200', bar: 'bg-red-500', example: 'TikTok', desc: 'Maximum risk. Designed to extract maximum value from users while offering minimal protections. Avoid or minimize usage.' },
]

const FACTORS = [
  ['Data collection scope', 'How much data is collected and whether it\'s proportionate to the service'],
  ['Third-party sharing', 'Who else gets your data, and whether you can opt out'],
  ['Content licensing', 'What rights you grant the company over content you create'],
  ['Arbitration clauses', 'Whether you can sue in court or are forced into private arbitration'],
  ['Liability limitations', 'How much accountability the company accepts if they harm you'],
  ['Terms change policy', 'How much notice you get before terms change, and your options'],
  ['Data retention', 'How long data is kept after you close your account'],
  ['Plain language', 'Whether the document is written to be understood or to obscure'],
]

export default function TransparencyScoresPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Scoring System</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How Transparency Scores Work</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Every company we analyze receives a transparency score from 1 to 9.
            The score reflects how well the company's Terms of Service respect user rights and provide genuine informed consent.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">The 1–9 Scale</h2>
          <div className="space-y-4">
            {SCORES.map(s => (
              <div key={s.range} className={`border rounded-xl p-5 ${s.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{s.range}</span>
                    <span className="text-sm font-bold uppercase tracking-wide">{s.label}</span>
                  </div>
                  <span className="text-xs font-medium opacity-70">e.g. {s.example}</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full mb-3 overflow-hidden">
                  <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${(parseInt(s.range) / 9) * 100}%` }} />
                </div>
                <p className="text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What Goes Into a Score</h2>
          <p className="text-gray-600 mb-4">Our AI evaluates eight primary factors when scoring a document:</p>
          <div className="space-y-3">
            {FACTORS.map(([factor, desc]) => (
              <div key={factor} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <Minus size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{factor}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Score vs. Risk Level</h2>
          <p className="text-gray-600 mb-4">Scores map to a risk level shown on each company card:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Low Risk', score: '7–9', color: 'bg-green-100 text-green-800' },
              { label: 'Medium Risk', score: '5–6', color: 'bg-yellow-100 text-yellow-800' },
              { label: 'High Risk', score: '3–4', color: 'bg-orange-100 text-orange-800' },
              { label: 'Critical', score: '1–2', color: 'bg-red-100 text-red-800' },
            ].map(r => (
              <div key={r.label} className={`rounded-lg p-3 text-center ${r.color}`}>
                <p className="text-sm font-bold">{r.label}</p>
                <p className="text-xs mt-1">Score {r.score}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
          <strong>Important:</strong> Scores are AI-generated assessments for educational purposes.
          They reflect the content of the Terms of Service document at the time of analysis — not the company's actual behavior.
          A high score doesn't mean a company is trustworthy; a low score doesn't mean it's illegal.{' '}
          <Link href="/methodology" className="underline font-medium">Read our full methodology.</Link>
        </div>
      </div>
    </div>
  )
}
