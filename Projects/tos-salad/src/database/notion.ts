import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config();

export interface TOSAnalysis {
  company_name: string;
  industry_category: string;
  risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
  transparency_score: number;
  red_flags_count: number;
  manipulation_tactics: string[];
  analysis_status: 'Not Started' | 'In Progress' | 'Complete' | 'Needs Review';
  document_url?: string;
  quote_examples?: string;
  public_summary?: string;
  consumer_impact?: string;
}

export class NotionDatabase {
  private notion: Client;
  private databaseId: string;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID!;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.notion.databases.retrieve({ database_id: this.databaseId });
      console.log('✓ Notion database connection successful');
      return true;
    } catch (error) {
      console.error('✗ Notion database connection failed:', error);
      return false;
    }
  }

  async getCompanyAnalysis(companyName: string): Promise<TOSAnalysis | null> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Company Name',
          title: {
            equals: companyName
          }
        }
      });

      if (response.results.length === 0) return null;

      const page = response.results[0] as any;
      const props = page.properties;

      return {
        company_name: props['Company Name']?.title?.[0]?.text?.content || '',
        industry_category: props['Industry Category']?.select?.name || '',
        risk_level: props['Risk Level']?.select?.name || 'Low',
        transparency_score: props['Transparency Score']?.number || 0,
        red_flags_count: props['Red Flags Count']?.number || 0,
        manipulation_tactics: props['Manipulation Tactics']?.multi_select?.map((t: any) => t.name) || [],
        analysis_status: props['Analysis Status']?.select?.name || 'Not Started',
        document_url: props['Document URL']?.url || '',
        quote_examples: props['Quote Examples']?.rich_text?.[0]?.text?.content || '',
        public_summary: props['Public Summary']?.rich_text?.[0]?.text?.content || '',
        consumer_impact: props['Consumer Impact']?.rich_text?.[0]?.text?.content || '',
      };
    } catch (error) {
      console.error('Error fetching company analysis:', error);
      return null;
    }
  }
}
