import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)

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

// API functions for server-side use
export const serverCompanyApi = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabaseServer
      .from('tos_analysis_companies')
      .select('*')
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByDomain(domain: string): Promise<Company | null> {
    const { data, error } = await supabaseServer
      .from('tos_analysis_companies')
      .select('*')
      .eq('domain', domain)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getWithAnalysis(id: string) {
    const { data, error } = await supabaseServer
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_documents(*),
        tos_analysis_results(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

export const serverAnalysisApi = {
  async getLatestForCompany(companyId: string): Promise<AnalysisResult | null> {
    const { data, error } = await supabaseServer
      .from('tos_analysis_results')
      .select('*')
      .eq('company_id', companyId)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    // Map CLI data structure to frontend expected format
    if (data) {
      data.red_flags = data.key_concerns?.map((concern: string, index: number) => ({
        clause: concern,
        severity: index < 3 ? 'high' : index < 7 ? 'medium' : 'low', // Map based on concern order
        explanation: concern,
        source_section: 'Terms of Service'
      })) || []
    }
    
    return data
  },

  async getAllResults(): Promise<AnalysisResult[]> {
    const { data, error } = await supabaseServer
      .from('tos_analysis_results')
      .select(`
        *,
        tos_analysis_documents!inner(
          *,
          tos_analysis_companies(*)
        )
      `)
      .order('analyzed_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(analysisId: string): Promise<AnalysisResult | null> {
    const { data, error } = await supabaseServer
      .from('tos_analysis_results')
      .select(`
        *,
        tos_analysis_documents!inner(
          *,
          tos_analysis_companies(*)
        )
      `)
      .eq('id', analysisId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}