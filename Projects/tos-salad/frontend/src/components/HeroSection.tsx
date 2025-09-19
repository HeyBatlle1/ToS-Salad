'use client'

import Link from 'next/link'
import { Shield, MessageSquare, AlertTriangle, Users, ArrowRight } from 'lucide-react'

export function HeroSection() {
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-interface')
    chatSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="lg:w-1/2 bg-gradient-to-br from-green-50 to-blue-50 p-8 flex items-center">
      <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-6">
          <Shield className="h-16 w-16 text-green-600 mb-4 lg:mb-0 lg:mr-4" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ToS Salad</h1>
            <p className="text-lg text-gray-600">Corporate Transparency Research</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Expose corporate manipulation through radical transparency. 
          We analyze Terms of Service to reveal predatory clauses and help you make informed decisions.
        </p>

        {/* Key Features */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={16} className="text-green-600" />
            </div>
            <span className="text-gray-700">AI-powered red flag detection</span>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-600" />
            </div>
            <span className="text-gray-700">Chat with our transparency assistant</span>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
            <span className="text-gray-700">12+ companies analyzed</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link 
            href="/companies"
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            View Company Reports
            <ArrowRight size={16} />
          </Link>
          
          <button 
            onClick={scrollToChat}
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <MessageSquare size={16} />
            Start Chatting
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Recently flagged:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              Replit: 19 red flags
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              Data harvesting clauses
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              Unfair termination terms
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}