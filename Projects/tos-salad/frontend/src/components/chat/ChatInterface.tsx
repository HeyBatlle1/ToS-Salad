'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatInterfaceProps {
  className?: string
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your transparency research assistant. Ask me about Terms of Service analysis, red flags to watch for, or specific companies you're curious about.",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className={cn('flex flex-col h-full bg-gradient-to-b from-gray-50 to-white', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-4 max-w-5xl',
              message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white',
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                : 'bg-gradient-to-br from-green-600 to-green-700 text-white'
            )}>
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            <div className={cn(
              'rounded-2xl px-6 py-5 max-w-[85%] shadow-lg border relative',
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500 shadow-blue-200'
                : 'bg-white text-gray-900 border-gray-200 shadow-gray-200'
            )}>
              <div className="prose prose-sm max-w-none">
                {message.role === 'assistant' ? (
                  // Enhanced formatting for assistant responses
                  <div className="space-y-3">
                    {message.content.split('\n\n').map((paragraph, i) => {
                      // Check if this paragraph contains quote-and-explain format
                      if (paragraph.includes('Original Text:') || paragraph.includes('Plain English Explanation:')) {
                        return (
                          <div key={i} className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
                            {paragraph.split('\n').map((line, j) => {
                              if (line.startsWith('Original Text:')) {
                                return (
                                  <div key={j} className="mb-4">
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                      <div className="text-xs font-bold text-green-800 uppercase tracking-wide">
                                        Original Terms of Service Text
                                      </div>
                                    </div>
                                    <div className="text-sm italic text-gray-900 bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm font-medium leading-relaxed">
                                      <span className="text-gray-600 mr-1">"</span>
                                      {line.replace('Original Text:', '').trim()}
                                      <span className="text-gray-600 ml-1">"</span>
                                    </div>
                                  </div>
                                )
                              } else if (line.startsWith('Plain English Explanation:')) {
                                return (
                                  <div key={j}>
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                      <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">
                                        Transparency Analysis
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-800 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                      {line.replace('Plain English Explanation:', '').trim()}
                                    </div>
                                  </div>
                                )
                              } else if (line.trim()) {
                                return (
                                  <p key={j} className="text-sm text-gray-700 mb-2 leading-relaxed">
                                    {line}
                                  </p>
                                )
                              }
                              return null
                            })}
                          </div>
                        )
                      } else if (paragraph.includes('Transparency Score:')) {
                        // Enhanced transparency score display
                        return (
                          <div key={i} className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl p-6 border-2 border-green-200 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                              <div className="text-sm font-bold text-green-900 uppercase tracking-wide">
                                Transparency Assessment
                              </div>
                            </div>
                            <div className="text-base font-semibold text-green-800 mt-3 leading-relaxed">
                              {paragraph}
                            </div>
                          </div>
                        )
                      } else {
                        // Enhanced regular paragraph formatting
                        return (
                          <div key={i} className="text-sm text-gray-800 leading-relaxed bg-gray-50/30 p-4 rounded-lg">
                            {paragraph.split('\n').map((line, j) => (
                              <p key={j} className="mb-2 last:mb-0 font-medium">
                                {line}
                              </p>
                            ))}
                          </div>
                        )
                      }
                    })}
                  </div>
                ) : (
                  // Enhanced user message formatting
                  <div className="text-sm">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0 text-white font-medium leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className={cn(
                'text-xs mt-4 pt-3 border-t font-medium',
                message.role === 'user'
                  ? 'text-blue-100 border-blue-400/30'
                  : 'text-gray-500 border-gray-200'
              )}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-5xl mr-auto">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white">
              <Bot size={20} />
            </div>
            <div className="bg-white rounded-2xl px-6 py-5 shadow-lg border border-gray-200 shadow-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100" />
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-200" />
                </div>
                <span className="text-sm text-gray-700 font-medium ml-2">Analyzing transparency data...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Error display */}
      {error && (
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 mx-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 text-red-800 text-sm font-medium">
            <AlertCircle size={18} />
            <span className="leading-relaxed">{error}</span>
          </div>
        </div>
      )}

      {/* Enhanced Input */}
      <div className="border-t-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 p-8">
        <form onSubmit={sendMessage} className="flex gap-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Terms of Service transparency, red flags, or specific companies..."
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 shadow-lg bg-white font-medium text-gray-900 transition-all duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg font-semibold transition-all duration-200"
          >
            <Send size={20} />
            Send
          </button>
        </form>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-700 font-medium">
            💡 Try asking: "What are the worst terms in Verizon's ToS?" or "Compare Spotify vs Signal transparency"
          </p>
          <div className="text-sm text-green-700 font-bold">
            Powered by Transparency Research
          </div>
        </div>
      </div>
    </div>
  )
}