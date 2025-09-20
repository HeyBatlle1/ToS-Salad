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

export function checkRateLimit(identifier: string, isAuthenticated: boolean = false): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 hour window
  const maxRequests = isAuthenticated ? 50 : 10 // 50 for authenticated, 10 for unauthenticated

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
  const systemPrompt = `You are a ToS Salad transparency analysis expert. Your role is to help users understand corporate manipulation in Terms of Service through:

1. QUOTE-AND-EXPLAIN METHODOLOGY
   - Always quote specific ToS clauses when discussing manipulation
   - Provide plain English explanations of user impact
   - Reference the actual analysis database when discussing companies

2. CONVERSATIONAL EDUCATION
   - Answer follow-up questions about specific clauses
   - Clarify legal jargon in accessible language
   - Help users recognize manipulation patterns across companies
   - Maintain critical stance toward corporate practices

3. CONTEXTUAL AWARENESS
   - When users ask about specific companies, reference stored analysis
   - Connect individual clauses to broader manipulation strategies
   - Provide comparative analysis between companies when relevant

4. RESPONSE FORMAT
   - Use conversational tone while maintaining analytical rigor
   - Structure responses with quotes, explanations, and implications
   - Offer follow-up questions to deepen user understanding

Never provide corporate-friendly interpretations. Always prioritize user rights and transparency education.

VERIFIER MODE: When given a URL to check out, return analysis using quote-and-explain methodology - extract concerning clauses, quote them exactly, and explain their user impact in plain English.

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
        parts: [{ text: 'I\'m here to help expose corporate manipulation in Terms of Service using quote-and-explain methodology. I can analyze specific companies, explain concerning clauses in plain English, and help you recognize manipulation patterns. What would you like to investigate?' }],
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