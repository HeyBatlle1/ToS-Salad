import { Pool, PoolClient } from 'pg'
import { env, isProduction, validateRequiredEnv } from './env'

// Global connection pool for serverless reuse
declare global {
  var __pg_pool: Pool | undefined
}

// Create a connection pool optimized for Neon + Netlify serverless
function createPool(): Pool {
  const connectionString = env.DATABASE_URL

  if (!connectionString) {
    console.error('DATABASE_URL not found. Available env vars:', {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NETLIFY_DATABASE_URL: !!process.env.NETLIFY_DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      NETLIFY: !!process.env.NETLIFY
    })
    throw new Error('DATABASE_URL environment variable is required')
  }

  console.log('Creating PostgreSQL pool for Netlify serverless with URL length:', connectionString.length)

  // Neon requires SSL in production and development
  const sslConfig = {
    rejectUnauthorized: false, // Neon uses self-signed certificates
  }

  return new Pool({
    connectionString,
    ssl: sslConfig, // Always use SSL for Neon
    max: 1, // Single connection for serverless
    min: 0, // Allow pool to scale to zero
    idleTimeoutMillis: 30000, // 30 second idle timeout
    connectionTimeoutMillis: 15000, // 15 second connection timeout
    allowExitOnIdle: true, // Allow process to exit when idle
    // Additional Neon-specific optimizations
    query_timeout: 30000, // 30 second query timeout
    statement_timeout: 30000, // 30 second statement timeout
    application_name: 'tos-salad-netlify', // Help identify connections in Neon
  })
}

// Reuse pool across function invocations
const pool = globalThis.__pg_pool ?? createPool()
if (process.env.NODE_ENV === 'development') globalThis.__pg_pool = pool

// Database types matching CLI schema (UUIDs)
export interface Company {
  id: string
  name: string
  domain: string
  industry?: string
  headquarters?: string
  founded_year?: number
  employee_count_range?: string
  revenue_range?: string
  stock_symbol?: string
  business_model?: string
  primary_services?: string[]
  tos_url?: string
  privacy_policy_url?: string
  data_policy_url?: string
  community_guidelines_url?: string
  corporate_website?: string
  last_scraped_at?: string
  last_analyzed_at?: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  company_id: string
  document_type: 'terms_of_service' | 'privacy_policy' | 'data_policy' | 'community_guidelines' | 'cookie_policy' | 'other'
  title?: string
  url: string
  raw_content?: string
  cleaned_content?: string
  content_hash?: string
  scraped_at: string
  http_status?: number
  content_length?: number
  content_type?: string
  last_modified_header?: string
  etag?: string
  is_analyzed: boolean
  analysis_version?: string
  created_at: string
  updated_at: string
}

export interface AnalysisResult {
  id: string
  document_id: string
  company_id: string
  transparency_score?: number
  user_friendliness_score?: number
  privacy_score?: number
  manipulation_risk_score?: number
  data_collection_risk?: 'low' | 'medium' | 'high' | 'critical'
  data_sharing_risk?: 'low' | 'medium' | 'high' | 'critical'
  account_termination_risk?: 'low' | 'medium' | 'high' | 'critical'
  legal_jurisdiction_risk?: 'low' | 'medium' | 'high' | 'critical'
  concerning_clauses?: any
  manipulation_tactics?: any
  user_rights_analysis?: any
  data_retention_analysis?: any
  third_party_sharing?: any
  gdpr_compliance_status?: string
  ccpa_compliance_status?: string
  coppa_compliance_status?: string
  regulatory_notes?: string
  ai_model_used: string
  analysis_version: string
  analyzed_at: string
  analysis_duration_ms?: number
  executive_summary?: string
  key_concerns?: string[]
  recommendations?: string[]
  red_flags?: RedFlag[]
  summary?: string
  created_at?: string
}

export interface RedFlag {
  clause: string
  severity: 'low' | 'medium' | 'high'
  explanation: string
  source_section?: string
}

// Database connection helper with Neon-optimized error handling
export async function query(text: string, params?: any[], retries: number = 2): Promise<any> {
  // Validate environment variables at runtime
  validateRequiredEnv()

  console.log('Executing query:', text.substring(0, 100) + '...')
  let client: PoolClient | null = null

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      client = await pool.connect()
      const result = await client.query(text, params)
      console.log(`Query returned ${result.rows.length} rows (attempt ${attempt})`)
      return result
    } catch (error) {
      console.error(`Database query error (attempt ${attempt}/${retries + 1}):`, error)

      if (client) {
        client.release()
        client = null
      }

      // If this is the last attempt, throw the error
      if (attempt === retries + 1) {
        console.error('Final attempt failed. Query was:', text)
        console.error('Params were:', params)
        console.error('Database URL configured:', !!env.DATABASE_URL)

        // Provide more specific error info for Neon issues
        if (error instanceof Error) {
          if (error.message.includes('ENOTFOUND') || error.message.includes('connect ETIMEDOUT')) {
            throw new Error(`Database connection failed: ${error.message}. Check DATABASE_URL and network connectivity.`)
          }
          if (error.message.includes('password authentication failed')) {
            throw new Error(`Database authentication failed: ${error.message}. Check DATABASE_URL credentials.`)
          }
          if (error.message.includes('database') && error.message.includes('does not exist')) {
            throw new Error(`Database not found: ${error.message}. Check DATABASE_URL database name.`)
          }
        }

        throw error
      }

      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    } finally {
      if (client) {
        client.release()
      }
    }
  }
}

// Health check function
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as test')
    return result.rows[0]?.test === 1
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// API functions for frontend
export const companyApi = {
  async getAll(): Promise<Company[]> {
    const result = await query(`
      SELECT * FROM tos_analysis_companies
      ORDER BY updated_at DESC
    `)
    return result.rows
  },

  async getByDomain(domain: string): Promise<Company | null> {
    const result = await query(`
      SELECT * FROM tos_analysis_companies
      WHERE domain = $1
    `, [domain])
    return result.rows[0] || null
  },

  async getWithAnalysis(id: string) {
    const result = await query(`
      SELECT
        c.*,
        json_agg(DISTINCT d.*) FILTER (WHERE d.id IS NOT NULL) as documents,
        json_agg(DISTINCT a.*) FILTER (WHERE a.id IS NOT NULL) as analyses
      FROM tos_analysis_companies c
      LEFT JOIN tos_analysis_documents d ON c.id = d.company_id
      LEFT JOIN tos_analysis_results a ON c.id = a.company_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id])
    return result.rows[0] || null
  }
}

export const analysisApi = {
  async getLatestForCompany(companyId: string): Promise<AnalysisResult | null> {
    const result = await query(`
      SELECT * FROM tos_analysis_results
      WHERE company_id = $1
      ORDER BY analyzed_at DESC
      LIMIT 1
    `, [companyId])
    return result.rows[0] || null
  },

  async getById(id: string): Promise<any | null> {
    const result = await query(`
      SELECT
        r.*,
        d.url as document_url,
        d.title as document_title,
        d.document_type,
        c.name as company_name,
        c.domain as company_domain,
        json_build_object(
          'id', d.id,
          'url', d.url,
          'title', d.title,
          'document_type', d.document_type
        ) as document
      FROM tos_analysis_results r
      INNER JOIN tos_analysis_documents d ON r.document_id = d.id
      INNER JOIN tos_analysis_companies c ON r.company_id = c.id
      WHERE r.id = $1
    `, [id])
    return result.rows[0] || null
  },

  async getAllResults(): Promise<AnalysisResult[]> {
    const result = await query(`
      SELECT
        r.*,
        d.*,
        c.name as company_name,
        c.domain as company_domain
      FROM tos_analysis_results r
      INNER JOIN tos_analysis_documents d ON r.document_id = d.id
      INNER JOIN tos_analysis_companies c ON r.company_id = c.id
      ORDER BY r.analyzed_at DESC
    `)
    return result.rows
  }
}

// Graceful shutdown for serverless environments
if (typeof process !== 'undefined') {
  let isCleaningUp = false

  const cleanup = async () => {
    if (isCleaningUp) return
    isCleaningUp = true

    try {
      if (!pool.ended) {
        await pool.end()
      }
    } catch (error) {
      // Only log error in development to avoid noise
      if (process.env.NODE_ENV === 'development') {
        console.error('Error during pool cleanup:', error)
      }
    }
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  // For Netlify Functions, cleanup when function ends
  if (process.env.NETLIFY) {
    process.on('beforeExit', cleanup)
  }
}