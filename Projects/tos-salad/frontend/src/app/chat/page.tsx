import { ChatInterface } from '@/components/chat/ChatInterface'
import { MessageSquare } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Transparency Assistant</h1>
            <p className="text-xs text-gray-500">Ask anything about Terms of Service, company practices, or red flags</p>
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-4xl w-full mx-auto">
        <ChatInterface />
      </div>
    </div>
  )
}
