import { BookOpen, Quote, Search, Shield, AlertTriangle, Scale } from 'lucide-react'

export const metadata = {
  title: 'Our Methodology — ToS Salad',
  description: 'How ToS Salad analyzes Terms of Service documents — our quote-and-explain methodology, scoring system, and editorial standards.',
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Methodology</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How We Analyze Terms of Service</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            ToS Salad uses a structured, reproducible methodology designed for educational clarity and legal safety.
            Every analysis follows the same process — no exceptions.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Quote className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">1. Quote and Explain</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our core methodology is simple: <strong>extract the exact clause, then explain it in plain English</strong>.
              We never paraphrase or editorialize the original text — you see exactly what the company wrote,
              followed by what it actually means for a normal person.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Example</p>
              <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg mb-3">
                <p className="text-xs font-bold text-green-800 mb-1">Original Text</p>
                <p className="text-sm italic text-gray-800">"We may share your information with our partners, affiliates, and third-party service providers for business purposes."</p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-xs font-bold text-blue-800 mb-1">Plain English</p>
                <p className="text-sm text-gray-700">This gives the company permission to sell or share your personal data with other companies — including advertisers — without needing to ask you each time.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">2. What We Look For</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our AI analysis targets specific categories of concerning clauses. These were identified through
              review of hundreds of ToS documents and consultation with digital rights principles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['Data Harvesting', 'Broad permissions to collect, share, or sell personal data'],
                ['Perpetual Licenses', 'Rights to your content that survive account deletion'],
                ['Forced Arbitration', 'Clauses that waive your right to sue in court'],
                ['Unilateral Changes', 'Ability to change terms without meaningful notice'],
                ['Liability Caps', 'Limits on what the company owes you if they harm you'],
                ['Surveillance Permissions', 'Rights to monitor your behavior, messages, or device'],
                ['Data Retention', 'How long they keep your data after you leave'],
                ['Third-Party Sharing', 'Who else gets your data and under what conditions'],
              ].map(([title, desc]) => (
                <div key={title} className="bg-red-50 border border-red-100 rounded-lg p-3">
                  <p className="text-sm font-semibold text-red-800 mb-1">{title}</p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">3. The Signal Benchmark</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Signal's Terms of Service serve as our benchmark for what user-friendly terms actually look like.
              Signal operates a global messaging service for millions of people without perpetual content licenses,
              forced arbitration, data mining permissions, or surveillance capitalism terms.
              Every predatory clause we flag in other platforms is a <strong>deliberate choice</strong> — not a technical necessity.
              Signal proves it.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">4. AI-Assisted, Human-Reviewed</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our featured company analyses (those in the Companies database) are AI-assisted and curated by our team.
              Community-submitted analyses run entirely through Gemini AI and are labeled as such.
            </p>
            <p className="text-gray-700 leading-relaxed">
              AI analysis is not perfect. We use Gemini 2.5 Flash for its speed and strong reasoning,
              but all AI output should be treated as a starting point for your own research — not a final verdict.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">5. What We Don't Do</h2>
            </div>
            <ul className="space-y-2 text-gray-700">
              {[
                'We do not provide legal advice. Our analysis is educational only.',
                'We do not republish entire ToS documents — only specific clauses for commentary.',
                'We do not accept payment from companies for favorable analysis.',
                'We do not store personal data from users of this site.',
                'We do not make absolute determinations — we provide evidence and let you decide.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
