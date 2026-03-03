-- ToS Salad - Clean Schema
-- Run this on a fresh NeonDB project

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main companies table - mirrors the Notion database structure
CREATE TABLE IF NOT EXISTS companies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notion_id     TEXT UNIQUE,                    -- Notion page ID for sync
  name          TEXT NOT NULL,
  domain        TEXT UNIQUE,
  industry      TEXT,
  platform_type TEXT,
  user_base_millions INTEGER,

  -- Scores (1-9 scale, matches Notion)
  transparency_score INTEGER,

  -- Risk classification
  risk_level    TEXT CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  red_flags_count INTEGER DEFAULT 0,

  -- Content fields
  document_url        TEXT,
  public_summary      TEXT,
  consumer_impact     TEXT,
  educational_content TEXT,
  quote_examples      TEXT,
  full_tos_text       TEXT,
  recent_violations   TEXT,
  regulatory_fines    NUMERIC,

  -- Array fields
  manipulation_tactics TEXT[],

  -- Metadata
  analysis_status   TEXT DEFAULT 'Pending',
  collection_method TEXT,
  tos_collection_date DATE,
  last_synced_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_score  ON companies(transparency_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(analysis_status);

-- Simple function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
