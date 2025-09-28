'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, MessageSquare, Users, Github, Info } from 'lucide-react'
import { LoginModal } from '@/components/auth/LoginModal'

export function Navigation() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and primary nav */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ToS Salad</span>
              </Link>

              {/* Primary Navigation */}
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/companies"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <Users className="inline-block w-4 h-4 mr-2" />
                  Companies
                </Link>
                <Link
                  href="/chat"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <MessageSquare className="inline-block w-4 h-4 mr-2" />
                  AI Agent
                </Link>
              </div>
            </div>

            {/* Secondary nav */}
            <div className="flex items-center space-x-4">
              {/* About/Info */}
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors hidden sm:block"
              >
                <Info className="inline-block w-4 h-4 mr-2" />
                About
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/HeyBatlle1/ToS-Salad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-green-600 p-2 rounded-lg transition-colors"
                title="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile navigation - you could expand this if needed */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Link
              href="/companies"
              className="flex flex-col items-center text-gray-700 hover:text-green-600 px-3 py-2 text-xs"
            >
              <Users className="h-5 w-5 mb-1" />
              Companies
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center text-gray-700 hover:text-green-600 px-3 py-2 text-xs"
            >
              <MessageSquare className="h-5 w-5 mb-1" />
              AI Agent
            </Link>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}