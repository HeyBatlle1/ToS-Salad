import { Pool } from 'pg'

declare global {
  var __pg_pool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL environment variable is required')

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
    application_name: 'tos-salad',
  })
}

const pool = globalThis.__pg_pool ?? createPool()
if (process.env.NODE_ENV === 'development') globalThis.__pg_pool = pool

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Company {
  id: string
  notion_id?: string
  name: string
  domain?: string
  industry?: string
  platform_type?: string
  user_base_millions?: number
  transparency_score?: number       // 1–9 scale
  risk_level?: 'Low' | 'Medium' | 'High' | 'Critical'
  red_flags_count?: number
  document_url?: string
  public_summary?: string
  consumer_impact?: string
  educational_content?: string
  quote_examples?: string
  full_tos_text?: string
  recent_violations?: string
  regulatory_fines?: number
  manipulation_tactics?: string[]
  analysis_status?: string
  collection_method?: string
  tos_collection_date?: string
  last_synced_at?: string
  created_at: string
  updated_at: string
}

/** Synthesised analysis view — built from the Company record so UI stays consistent. */
export interface AnalysisResult {
  id: string
  company_id: string
  transparency_score?: number       // multiplied to 0-100 for UI thresholds
  red_flags: RedFlag[]
  red_flags_count: number
  risk_level?: string
  analyzed_at: string
  executive_summary?: string
  full_analysis?: string
  educational_content?: string
  consumer_impact?: string
  quote_examples?: string
  manipulation_tactics?: string[]
  recent_violations?: string
  key_concerns?: string[]
  recommendations?: string[]
  privacy_score?: number
}

export interface RedFlag {
  clause: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
  source_section?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert 1-9 Notion score to 0-100 for UI colour thresholds. */
function scaleScore(score: number | undefined | null): number | undefined {
  if (score == null) return undefined
  return Math.round(score * 11)
}

/** Map risk_level → red flag severity. */
function riskToSeverity(risk?: string): 'low' | 'medium' | 'high' {
  if (risk === 'Critical') return 'high'
  if (risk === 'High') return 'high'
  if (risk === 'Medium') return 'medium'
  return 'low'
}

/** Build a synthetic AnalysisResult from a Company row. */
function toAnalysis(c: Company): AnalysisResult {
  const severity = riskToSeverity(c.risk_level)

  // Turn manipulation tactics into structured red flags for the card UI
  const red_flags: RedFlag[] = (c.manipulation_tactics ?? []).map(tactic => ({
    clause: tactic,
    severity,
    explanation: tactic,
  }))

  // Derive key_concerns from manipulation tactics
  const key_concerns = (c.manipulation_tactics ?? []).length > 0
    ? c.manipulation_tactics
    : undefined

  // Derive recommendations based on risk level
  const recommendationMap: Record<string, string[]> = {
    Critical: [
      'Consider not using this service or minimizing data shared',
      'Use a VPN and unique email address',
      'Regularly review and revoke permissions in account settings',
    ],
    High: [
      'Review privacy settings carefully before use',
      'Limit the personal data you provide',
      'Read any updates to terms before accepting',
    ],
    Medium: [
      'Be aware of data sharing practices',
      'Review account permissions periodically',
    ],
    Low: [
      'This service has relatively user-friendly terms',
      'Still worth reviewing settings periodically',
    ],
  }

  return {
    id: c.id,
    company_id: c.id,
    transparency_score: scaleScore(c.transparency_score),
    red_flags,
    red_flags_count: c.red_flags_count ?? red_flags.length,
    risk_level: c.risk_level,
    analyzed_at: c.last_synced_at ?? c.updated_at,
    executive_summary: c.public_summary,
    full_analysis: c.educational_content,
    educational_content: c.educational_content,
    consumer_impact: c.consumer_impact,
    quote_examples: c.quote_examples,
    manipulation_tactics: c.manipulation_tactics,
    recent_violations: c.recent_violations,
    key_concerns,
    recommendations: c.risk_level ? recommendationMap[c.risk_level] : undefined,
  }
}

// ─── DB Query ─────────────────────────────────────────────────────────────────

async function query(text: string, params?: any[]): Promise<any> {
  const client = await pool.connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const companyApi = {
  async getAll(): Promise<Array<Company & { latestAnalysis: AnalysisResult | null }>> {
    const result = await query(`
      SELECT * FROM companies
      WHERE analysis_status = 'Complete'
      ORDER BY transparency_score DESC NULLS LAST, name ASC
    `)
    return result.rows.map((c: Company) => ({
      ...c,
      latestAnalysis: toAnalysis(c),
    }))
  },

  async getByDomain(domain: string): Promise<(Company & { latestAnalysis: AnalysisResult | null }) | null> {
    const result = await query(
      `SELECT * FROM companies WHERE domain = $1 LIMIT 1`,
      [domain]
    )
    if (!result.rows[0]) return null
    const c: Company = result.rows[0]
    return { ...c, latestAnalysis: toAnalysis(c) }
  },

  async getById(id: string): Promise<(Company & { latestAnalysis: AnalysisResult | null }) | null> {
    const result = await query(
      `SELECT * FROM companies WHERE id = $1 LIMIT 1`,
      [id]
    )
    if (!result.rows[0]) return null
    const c: Company = result.rows[0]
    return { ...c, latestAnalysis: toAnalysis(c) }
  },

  /** All companies (including in-progress) for chat context. */
  async getAllForContext(): Promise<Company[]> {
    const result = await query(`SELECT name, domain, industry, transparency_score, risk_level, public_summary, manipulation_tactics, red_flags_count FROM companies ORDER BY transparency_score DESC NULLS LAST`)
    return result.rows
  },
}

// Keep analysisApi as a thin alias so existing imports don't break
export const analysisApi = {
  async getById(id: string): Promise<AnalysisResult | null> {
    const result = await query(`SELECT * FROM companies WHERE id = $1 LIMIT 1`, [id])
    if (!result.rows[0]) return null
    return toAnalysis(result.rows[0])
  },

  async getLatestForCompany(companyId: string): Promise<AnalysisResult | null> {
    const result = await query(`SELECT * FROM companies WHERE id = $1 LIMIT 1`, [companyId])
    if (!result.rows[0]) return null
    return toAnalysis(result.rows[0])
  },

  async getAllResults(): Promise<AnalysisResult[]> {
    const result = await query(`SELECT * FROM companies WHERE analysis_status = 'Complete'`)
    return result.rows.map(toAnalysis)
  },
}

export async function testConnection(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch {
    return false
  }
}

if (typeof process !== 'undefined') {
  const cleanup = async () => {
    try { if (!pool.ended) await pool.end() } catch {}
  }
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}
