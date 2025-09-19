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
    <div className={cn('flex flex-col h-full', className)}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3 max-w-4xl',
              message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            )}>
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={cn(
              'rounded-lg px-4 py-3 max-w-[80%]',
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            )}>
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className={cn(
                    'mb-2 last:mb-0',
                    message.role === 'user' ? 'text-white' : 'text-gray-900'
                  )}>
                    {line}
                  </p>
                ))}
              </div>
              <div className={cn(
                'text-xs mt-2 opacity-70',
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
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
          <div className="flex gap-3 max-w-4xl mr-auto">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 mx-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Terms of Service transparency..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Ask me about company transparency scores, red flags, or specific ToS concerns.
        </p>
      </div>
    </div>
  )
}