#!/usr/bin/env npx ts-node
/**
 * Migrate ToS Salad data from Notion → NeonDB
 * Run: DATABASE_URL=<your-neon-url> NOTION_TOKEN=<token> npx ts-node scripts/migrate-from-notion.ts
 */

import { Pool } from 'pg'

const NOTION_TOKEN   = process.env.NOTION_TOKEN
const NOTION_DB_ID   = '250eb635b65e4bfb8e556010b48762f1'
const DATABASE_URL   = process.env.DATABASE_URL

if (!NOTION_TOKEN) { console.error('❌ NOTION_TOKEN env var required'); process.exit(1) }
if (!DATABASE_URL) { console.error('❌ DATABASE_URL env var required'); process.exit(1) }

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
})

// Helper: extract text from Notion rich_text array
function getText(prop: any): string {
  return prop?.rich_text?.map((r: any) => r.text?.content || '').join('') || ''
}

function getTitle(prop: any): string {
  return prop?.title?.map((r: any) => r.text?.content || '').join('') || ''
}

function getNumber(prop: any): number | null {
  return prop?.number ?? null
}

function getSelect(prop: any): string | null {
  return prop?.select?.name ?? null
}

function getUrl(prop: any): string | null {
  return prop?.url ?? null
}

function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((s: any) => s.name) || []
}

function getDate(prop: any): string | null {
  return prop?.date?.start ?? null
}

async function fetchNotionRecords() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 100 }),
    }
  )
  const data = await res.json() as any
  if (data.object === 'error') throw new Error(`Notion API error: ${data.message}`)
  return data.results
}

function parseDomain(name: string, docUrl: string | null): string | null {
  // Try to extract domain from the document URL
  if (docUrl) {
    try {
      return new URL(docUrl).hostname.replace('www.', '')
    } catch {}
  }
  // Fallback: derive from company name
  const clean = name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')  // remove parenthetical
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)[0]
  return clean || null
}

async function migrateRecords(records: any[]) {
  const client = await pool.connect()
  let inserted = 0
  let skipped  = 0

  try {
    for (const page of records) {
      const p = page.properties
      const name = getTitle(p['Company Name'])
      if (!name) { skipped++; continue }

      const docUrl  = getUrl(p['Document URL'])
      const domain  = parseDomain(name, docUrl)
      const status  = getSelect(p['Analysis Status'])

      // Only migrate Complete records (and in-progress for structure)
      const score   = getNumber(p['Transparency Score'])
      const tactics = getMultiSelect(p['Manipulation Tactics'])

      const row = {
        notion_id:           page.id,
        name,
        domain,
        industry:            getSelect(p['Industry Category']),
        platform_type:       getText(p['Platform Type']),
        user_base_millions:  getNumber(p['User Base']),
        transparency_score:  score,
        risk_level:          getSelect(p['Risk Level']),
        red_flags_count:     getNumber(p['Red Flags Count']) ?? 0,
        document_url:        docUrl,
        public_summary:      getText(p['Public Summary']),
        consumer_impact:     getText(p['Consumer Impact']),
        educational_content: getText(p['Educational Content']),
        quote_examples:      getText(p['Quote Examples']),
        full_tos_text:       getText(p['Full ToS Text']),
        recent_violations:   getText(p['Recent Violations']),
        regulatory_fines:    getNumber(p['Regulatory Fines']),
        manipulation_tactics: tactics,
        analysis_status:     status || 'Pending',
        collection_method:   getSelect(p['Collection Method']),
        tos_collection_date: getDate(p['ToS Collection Date']),
        last_synced_at:      new Date().toISOString(),
      }

      await client.query(
        `INSERT INTO companies (
          notion_id, name, domain, industry, platform_type, user_base_millions,
          transparency_score, risk_level, red_flags_count, document_url,
          public_summary, consumer_impact, educational_content, quote_examples,
          full_tos_text, recent_violations, regulatory_fines, manipulation_tactics,
          analysis_status, collection_method, tos_collection_date, last_synced_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
        )
        ON CONFLICT (notion_id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          industry = EXCLUDED.industry,
          transparency_score = EXCLUDED.transparency_score,
          risk_level = EXCLUDED.risk_level,
          red_flags_count = EXCLUDED.red_flags_count,
          public_summary = EXCLUDED.public_summary,
          consumer_impact = EXCLUDED.consumer_impact,
          educational_content = EXCLUDED.educational_content,
          quote_examples = EXCLUDED.quote_examples,
          manipulation_tactics = EXCLUDED.manipulation_tactics,
          analysis_status = EXCLUDED.analysis_status,
          last_synced_at = EXCLUDED.last_synced_at
        `,
        [
          row.notion_id, row.name, row.domain, row.industry, row.platform_type,
          row.user_base_millions, row.transparency_score, row.risk_level,
          row.red_flags_count, row.document_url, row.public_summary,
          row.consumer_impact, row.educational_content, row.quote_examples,
          row.full_tos_text, row.recent_violations, row.regulatory_fines,
          row.manipulation_tactics, row.analysis_status, row.collection_method,
          row.tos_collection_date, row.last_synced_at,
        ]
      )
      console.log(`  ✅ ${name} (score: ${score ?? 'pending'})`)
      inserted++
    }
  } finally {
    client.release()
  }

  return { inserted, skipped }
}

async function main() {
  console.log('🥗 ToS Salad — Notion → NeonDB Migration\n')

  // 1. Test DB connection
  try {
    await pool.query('SELECT 1')
    console.log('✅ Database connected\n')
  } catch (e: any) {
    console.error('❌ Database connection failed:', e.message)
    process.exit(1)
  }

  // 2. Fetch from Notion
  console.log('📥 Fetching from Notion...')
  const records = await fetchNotionRecords()
  console.log(`   Found ${records.length} records\n`)

  // 3. Migrate
  console.log('💾 Migrating records...')
  const { inserted, skipped } = await migrateRecords(records)

  // 4. Verify
  const result = await pool.query(
    `SELECT analysis_status, COUNT(*) as count FROM companies GROUP BY analysis_status ORDER BY count DESC`
  )
  console.log('\n📊 Database summary:')
  for (const row of result.rows) {
    console.log(`   ${row.analysis_status}: ${row.count} companies`)
  }

  const top = await pool.query(
    `SELECT name, transparency_score, risk_level FROM companies WHERE transparency_score IS NOT NULL ORDER BY transparency_score DESC LIMIT 5`
  )
  console.log('\n🏆 Top companies by transparency:')
  for (const row of top.rows) {
    console.log(`   ${row.name}: ${row.transparency_score}/9 (${row.risk_level})`)
  }

  console.log(`\n✅ Done — ${inserted} migrated, ${skipped} skipped`)
  await pool.end()
}

main().catch(e => {
  console.error('❌ Migration failed:', e)
  pool.end()
  process.exit(1)
})
