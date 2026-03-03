import { FileText } from 'lucide-react'

export const metadata = {
  title: 'Terms of Use — ToS Salad',
  description: 'ToS Salad\'s own terms of use — written plainly, as we expect others to write theirs.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Terms of Use</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Terms of Use</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We're a transparency project, so our own terms should be transparent.
            These are written in plain English — the way we believe all ToS documents should be written.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: March 2026 · Transparency Score: 9/9</p>
        </div>

        <div className="space-y-8 text-gray-700">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What This Site Is</h2>
            <p className="leading-relaxed">
              ToS Salad is a free, non-profit educational service. We analyze Terms of Service documents
              and explain their implications in plain English. We are not lawyers, and nothing on this site
              is legal advice. We are researchers, technologists, and advocates for digital rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What You Can Do</h2>
            <ul className="space-y-2">
              {[
                'Use the site freely without creating an account.',
                'Submit Terms of Service documents for AI analysis.',
                'Share analysis pages with others.',
                'Quote our analysis for non-commercial educational or journalistic purposes with attribution.',
                'Delete analyses you submitted using the delete button.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What You Can't Do</h2>
            <ul className="space-y-2">
              {[
                'Submit documents that contain malware, illegal content, or content you don\'t have rights to share.',
                'Attempt to manipulate our AI analysis through prompt injection or other adversarial inputs.',
                'Use automated scripts to scrape or abuse our API beyond normal use.',
                'Misrepresent AI-generated analysis as legal advice or human expert review.',
                'Use this service for purposes that harm others.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Content License</h2>
            <p className="leading-relaxed">
              Our original written content — methodology, explanations, scoring descriptions — is licensed under{' '}
              <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Creative Commons Attribution-NonCommercial-ShareAlike 4.0
              </a>.
              You can share and adapt it for non-commercial purposes with attribution.
              Our code is available on{' '}
              <a href="https://github.com/HeyBatlle1/ToS-Salad" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>{' '}
              under AGPL-3.0.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Disclaimer</h2>
            <p className="leading-relaxed mb-3">
              All analysis on this site is for educational purposes only. AI can make mistakes.
              Do not rely on our analysis for legal decisions — consult a qualified attorney.
            </p>
            <p className="leading-relaxed">
              We make no warranties about the accuracy, completeness, or timeliness of any analysis.
              ToS documents change; our analysis reflects the version at time of collection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to These Terms</h2>
            <p className="leading-relaxed">
              If we change these terms in ways that affect your rights, we'll update this page and the date above.
              We won't make material changes without notice. If you disagree with a change, you can stop using the site —
              and we'll delete any data you've submitted on request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contact</h2>
            <p className="leading-relaxed">
              Questions about these terms: <a href="mailto:legal@tossalad.com" className="text-green-600 hover:underline">legal@tossalad.com</a>
            </p>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800">
            <strong>No forced arbitration. No liability caps below actual harm. No unilateral changes without notice. No data selling.</strong>
            {' '}We score ourselves a 9/9. Hold us to it.
          </div>
        </div>
      </div>
    </div>
  )
}
