import { GoogleGenAI } from '@google/genai'

const MODEL = 'gemini-3.0-flash'

function getClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_GEMINI_API_KEY is not set')
  return new GoogleGenAI({ apiKey })
}

// ─── Rate Limiting ─────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, isAuthenticated = false): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000
  const maxRequests = isAuthenticated ? 50 : 10

  const current = rateLimitMap.get(identifier)
  if (!current || now > current.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (current.count >= maxRequests) return false
  current.count++
  return true
}

// ─── Chat Response ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a ToS Salad transparency analysis expert. Your role is to help everyday people — not just lawyers or tech experts — understand what they're actually agreeing to when they accept Terms of Service.

CORE METHODOLOGY — Quote and Explain:
- When discussing a concerning clause, quote the exact text first
- Then explain in plain English what it means for a normal person
- Use language anyone can understand, no jargon

YOUR STANCE:
- Always prioritize the user's perspective and rights
- Be direct about when a company's terms are predatory or manipulative
- Use Signal as the positive example — it proves user-friendly terms are a choice, not a necessity

RESPONSE STYLE:
- Conversational but informative
- Short paragraphs, not walls of text
- Use the company data provided to give specific, accurate answers
- When users ask about a company, lead with the most important findings`

export async function generateChatResponse(
  message: string,
  context?: { companies?: any[] }
): Promise<string> {
  const ai = getClient()

  const contextBlock = context?.companies?.length
    ? `\n\nOur database contains analysis of these companies:\n${JSON.stringify(context.companies, null, 2)}`
    : ''

  const contents = [
    {
      role: 'user' as const,
      parts: [{ text: SYSTEM_PROMPT + contextBlock }],
    },
    {
      role: 'model' as const,
      parts: [{ text: "I'm here to help you understand what you're really agreeing to. Ask me about any company's Terms of Service, or I can walk you through the biggest red flags we've found. What would you like to know?" }],
    },
    {
      role: 'user' as const,
      parts: [{ text: message }],
    },
  ]

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      temperature: 0.2,
      topP: 0.95,
      maxOutputTokens: 4096,
    },
  })

  return response.text ?? ''
}

// ─── ToS Document Analysis ──────────────────────────────────────────────────

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
  const ai = getClient()

  const prompt = `Analyze the following Terms of Service document for ${companyName}.

Identify predatory clauses, manipulation tactics, and consumer rights concerns.
Rate transparency from 1-9 (1 = extremely predatory, 9 = fully transparent and user-friendly).

Document:
${content.substring(0, 50000)}

Respond ONLY with valid JSON in this exact format:
{
  "transparencyScore": <number 1-9>,
  "redFlags": [
    {
      "clause": "<exact quote from document>",
      "severity": "low|medium|high",
      "explanation": "<plain English explanation of what this means for users>",
      "sourceSection": "<section name if available>"
    }
  ],
  "summary": "<2-3 sentence plain English assessment>"
}`

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.1, maxOutputTokens: 8192 },
  })

  const text = response.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)

  try {
    return JSON.parse(jsonMatch?.[0] ?? text)
  } catch {
    return {
      transparencyScore: 0,
      redFlags: [{ clause: 'Analysis failed', severity: 'high', explanation: 'Could not parse results' }],
      summary: text.substring(0, 500),
    }
  }
}
