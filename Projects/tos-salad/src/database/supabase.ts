import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database interfaces matching our schema
export interface Company {
  id: string;
  name: string;
  domain: string;
  industry?: string;
  headquarters?: string;
  founded_year?: number;
  employee_count_range?: string;
  revenue_range?: string;
  stock_symbol?: string;
  business_model?: string;
  primary_services?: string[];
  tos_url?: string;
  privacy_policy_url?: string;
  data_policy_url?: string;
  community_guidelines_url?: string;
  corporate_website?: string;
  last_scraped_at?: string;
  last_analyzed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TosDocument {
  id: string;
  company_id: string;
  document_type: 'terms_of_service' | 'privacy_policy' | 'data_policy' | 'community_guidelines' | 'cookie_policy' | 'other';
  title?: string;
  url: string;
  raw_content?: string;
  cleaned_content?: string;
  content_hash?: string;
  scraped_at: string;
  http_status?: number;
  content_length?: number;
  content_type?: string;
  last_modified_header?: string;
  etag?: string;
  is_analyzed: boolean;
  analysis_version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisResult {
  id: string;
  document_id: string;
  company_id: string;
  transparency_score?: number;
  user_friendliness_score?: number;
  privacy_score?: number;
  manipulation_risk_score?: number;
  data_collection_risk?: 'low' | 'medium' | 'high' | 'critical';
  data_sharing_risk?: 'low' | 'medium' | 'high' | 'critical';
  account_termination_risk?: 'low' | 'medium' | 'high' | 'critical';
  legal_jurisdiction_risk?: 'low' | 'medium' | 'high' | 'critical';
  concerning_clauses?: any;
  manipulation_tactics?: any;
  user_rights_analysis?: any;
  data_retention_analysis?: any;
  third_party_sharing?: any;
  gdpr_compliance_status?: string;
  ccpa_compliance_status?: string;
  coppa_compliance_status?: string;
  regulatory_notes?: string;
  ai_model_used: string;
  analysis_version: string;
  analyzed_at: string;
  analysis_duration_ms?: number;
  executive_summary?: string;
  key_concerns?: string[];
  recommendations?: string[];
  created_at?: string;
}

// Database operations class
export class TosSaladDB {
  
  // Company operations
  async getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async getCompanyByDomain(domain: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .eq('domain', domain)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  }
  
  async createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .insert(company)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Document operations
  async getDocumentsByCompany(companyId: string): Promise<TosDocument[]> {
    const { data, error } = await supabase
      .from('tos_analysis_documents')
      .select('*')
      .eq('company_id', companyId)
      .order('scraped_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async createDocument(document: Omit<TosDocument, 'id' | 'created_at' | 'updated_at'>): Promise<TosDocument> {
    const { data, error } = await supabase
      .from('tos_analysis_documents')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Analysis operations
  async getAnalysesByCompany(companyId: string): Promise<AnalysisResult[]> {
    const { data, error } = await supabase
      .from('tos_analysis_results')
      .select('*')
      .eq('company_id', companyId)
      .order('analyzed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  async createAnalysis(analysis: Omit<AnalysisResult, 'id' | 'created_at'>): Promise<AnalysisResult> {
    const { data, error } = await supabase
      .from('tos_analysis_results')
      .insert(analysis)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Search and filtering
  async searchCompanies(query: string): Promise<Company[]> {
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .select('*')
      .or(`name.ilike.%${query}%,domain.ilike.%${query}%,industry.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
  
  // Get companies with high-risk analysis results
  async getHighRiskCompanies(minRiskScore: number = 70): Promise<any[]> {
    const { data, error } = await supabase
      .from('tos_analysis_companies')
      .select(`
        *,
        tos_analysis_results!inner(
          transparency_score,
          manipulation_risk_score,
          analyzed_at
        )
      `)
      .gte('tos_analysis_results.manipulation_risk_score', minRiskScore)
      .order('tos_analysis_results.analyzed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
}