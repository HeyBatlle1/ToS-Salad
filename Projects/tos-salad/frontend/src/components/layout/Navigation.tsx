'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, MessageSquare, Users, Github, User, LogOut } from 'lucide-react'
import { LoginModal } from '@/components/auth/LoginModal'
import { supabase } from '@/lib/supabase-client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Navigation() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">ToS Salad</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <MessageSquare size={16} />
                <span>Chat</span>
              </Link>

              <Link
                href="/companies"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Users size={16} />
                <span>Companies</span>
              </Link>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <Github size={20} />
              </a>

              {/* Authentication */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-1 bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setShowLoginModal(false)}
      />
    </>
  )
}