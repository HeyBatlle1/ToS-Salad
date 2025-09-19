import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
})

// Rate limiting state
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
  const maxRequests = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '30')
  
  const current = rateLimitMap.get(identifier)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

export async function generateChatResponse(
  message: string, 
  context?: { companies?: any[], analyses?: any[] }
): Promise<string> {
  const systemPrompt = `You are a transparency research assistant for ToS Salad, a platform that analyzes Terms of Service documents to expose corporate manipulation tactics.

Your role is to help users understand:
- How companies use predatory clauses in their Terms of Service
- What red flags to look for in ToS documents
- How transparency scores are calculated
- Which companies have the most concerning practices

Always provide specific examples and cite sources when discussing company practices. Be educational and empowering, helping users make informed decisions about the services they use.

${context?.companies ? `Available company data: ${JSON.stringify(context.companies.slice(0, 5))}` : ''}
${context?.analyses ? `Recent analyses: ${JSON.stringify(context.analyses.slice(0, 3))}` : ''}`

  const chat = geminiModel.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I\'m here to help users understand Terms of Service transparency and corporate manipulation tactics. How can I assist with transparency research today?' }],
      },
    ],
  })

  const result = await chat.sendMessage(message)
  return result.response.text()
}

export async function analyzeToSDocument(
  content: string,
  companyName: string
): Promise<{
  transparencyScore: number
  redFlags: Array<{
    clause: string
    severity: 'low' | 'medium' | 'high'
    explanation: string
    sourceSection?: string
  }>
  summary: string
}> {
  const prompt = `Analyze the following Terms of Service document for ${companyName}. 

Focus on identifying:
1. Predatory clauses that favor the company over consumers
2. Manipulation tactics and dark patterns
3. Unclear or deceptive language
4. Consumer rights violations
5. Privacy and data usage concerns

Rate transparency from 0-100 (0 = completely opaque, 100 = fully transparent).

Document content:
${content.substring(0, 50000)} // Truncate for API limits

Respond in JSON format:
{
  "transparencyScore": number,
  "redFlags": [
    {
      "clause": "exact text from document",
      "severity": "low|medium|high", 
      "explanation": "why this is problematic",
      "sourceSection": "section name if available"
    }
  ],
  "summary": "overall assessment of document transparency"
}`

  const result = await geminiModel.generateContent(prompt)
  const responseText = result.response.text()
  
  try {
    return JSON.parse(responseText)
  } catch (error) {
    // Fallback parsing if JSON is malformed
    return {
      transparencyScore: 0,
      redFlags: [{
        clause: "Analysis failed",
        severity: 'high' as const,
        explanation: "Could not parse analysis results",
      }],
      summary: responseText.substring(0, 500)
    }
  }
}