import { Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — ToS Salad',
  description: 'ToS Salad\'s privacy policy. We collect almost nothing. Here\'s exactly what we do and don\'t do with your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Lock className="h-5 w-5 text-green-700" />
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We're a transparency organization. That means we hold ourselves to the same standards we apply to others.
            This policy is written in plain English — not legalese.
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-700">

          <section className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-900 mb-3">The Short Version</h2>
            <ul className="space-y-2 text-green-800">
              {[
                'We don\'t sell your data. Ever.',
                'We don\'t run ads or work with ad networks.',
                'We don\'t require an account to use this site.',
                'We don\'t store personal information beyond what\'s in your requests.',
                'We hash IP addresses for rate limiting — we never store plain IPs.',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">What We Collect</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Chat messages',
                  detail: 'When you use the chat feature, your message is sent to Google\'s Gemini API for processing. We do not store your chat history in our database. Messages are held in memory only for the duration of your session.',
                },
                {
                  title: 'ToS analysis submissions',
                  detail: 'When you submit a Terms of Service for analysis, we store the company name, the ToS URL (if provided), and the analysis results (score, red flags, summary). We do not store the full text of documents you paste. Submissions are associated with a random ID — not your identity.',
                },
                {
                  title: 'Rate limiting (IP hash)',
                  detail: 'To prevent abuse, we hash your IP address using SHA-256 and store the hash (not the IP itself) in our database for up to 1 hour. A hash cannot be reversed to recover your IP address. We delete these records automatically.',
                },
                {
                  title: 'Server logs',
                  detail: 'Our hosting provider (Netlify) and database provider (NeonDB) may retain standard server logs including IP addresses per their own policies. We don\'t control this data.',
                },
              ].map(item => (
                <div key={item.title} className="border border-gray-200 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                  <p className="text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Third-Party Services We Use</h2>
            <div className="space-y-3">
              {[
                ['Google Gemini API', 'AI analysis and chat responses. Your messages are sent to Google for processing per Google\'s API Terms of Service and Privacy Policy.'],
                ['Netlify', 'Hosting and serverless functions. Standard web hosting with traffic logging.'],
                ['NeonDB (PostgreSQL)', 'Database for company analyses and rate limit records. Hosted on AWS.'],
              ].map(([service, desc]) => (
                <div key={service} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-semibold text-gray-900 min-w-[140px]">{service}</span>
                  <span className="text-sm text-gray-600">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use localStorage (browser storage) to remember which analyses you created, so the delete and submit
              buttons appear for your own analyses. This data never leaves your browser. We do not use tracking
              cookies, analytics cookies, or advertising pixels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Rights</h2>
            <p className="leading-relaxed mb-3">
              Since we don't collect personal data tied to your identity, there isn't much to request.
              But if you submitted an analysis and want it deleted, use the Delete button on the analysis page.
              If you have questions, email <a href="mailto:privacy@tossalad.com" className="text-green-600 hover:underline">privacy@tossalad.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Changes to This Policy</h2>
            <p className="leading-relaxed">
              If we make material changes to how we handle data, we'll update this page and the date above.
              We won't bury changes in a paragraph about something else.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
