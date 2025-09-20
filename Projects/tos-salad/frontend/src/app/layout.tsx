import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Navigation } from '@/components/layout/Navigation'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ToS Salad - Corporate Transparency Research',
  description: 'Expose corporate Terms of Service manipulation through radical transparency. AI-powered analysis of predatory clauses and consumer rights violations.',
  keywords: 'terms of service, privacy policy, transparency, consumer rights, corporate accountability',
  authors: [{ name: 'ToS Salad' }],
  openGraph: {
    title: 'ToS Salad - Corporate Transparency Research',
    description: 'Expose corporate Terms of Service manipulation through radical transparency',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-semibold text-gray-900">ToS Salad</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Exposing corporate manipulation through radical transparency. 
                    We analyze Terms of Service to help consumers make informed decisions.
                  </p>
                  <p className="text-xs text-gray-500">
                    Educational use only. Fair use applies to quoted content.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Research</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/methodology" className="hover:text-green-600">Methodology</Link></li>
                    <li><Link href="/transparency-scores" className="hover:text-green-600">Transparency Scores</Link></li>
                    <li><Link href="/red-flags" className="hover:text-green-600">Red Flag Detection</Link></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><Link href="/fair-use" className="hover:text-green-600">Fair Use Policy</Link></li>
                    <li><Link href="/privacy" className="hover:text-green-600">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="hover:text-green-600">Our Terms</Link></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-8">
                <p className="text-center text-xs text-gray-500">
                  © 2024 ToS Salad. Built for transparency research and consumer advocacy.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
