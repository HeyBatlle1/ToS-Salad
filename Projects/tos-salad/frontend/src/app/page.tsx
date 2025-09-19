import { ChatInterface } from '@/components/chat/ChatInterface'
import { HeroSection } from '@/components/HeroSection'

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <HeroSection />

      {/* Chat Interface Section */}
      <div className="lg:w-1/2 bg-white flex flex-col" id="chat-interface">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ask Our Transparency Assistant
          </h2>
          <p className="text-gray-600 text-sm">
            Get insights about company practices, red flags, and transparency scores. 
            Try asking: "What are the worst terms in Replit's ToS?"
          </p>
        </div>
        
        <div className="flex-1">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}
