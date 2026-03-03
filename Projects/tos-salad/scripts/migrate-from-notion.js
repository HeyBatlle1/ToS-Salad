#!/usr/bin/env node
/**
 * Migrate ToS Salad data: Notion → NeonDB
 */

const { Pool } = require('pg')

const NOTION_TOKEN = process.env.NOTION_TOKEN
if (!NOTION_TOKEN) { console.error('❌ NOTION_TOKEN env var required'); process.exit(1) }
const NOTION_DB_ID = '250eb635b65e4bfb8e556010b48762f1'
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) { console.error('❌ DATABASE_URL required'); process.exit(1) }

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
})

const getText    = p => p?.rich_text?.map(r => r.text?.content || '').join('') || ''
const getTitle   = p => p?.title?.map(r => r.text?.content || '').join('') || ''
const getNumber  = p => p?.number ?? null
const getSelect  = p => p?.select?.name ?? null
const getUrl     = p => p?.url ?? null
const getMulti   = p => p?.multi_select?.map(s => s.name) || []
const getDate    = p => p?.date?.start ?? null

function parseDomain(name, docUrl) {
  if (docUrl) {
    try { return new URL(docUrl).hostname.replace('www.', '') } catch {}
  }
  return name.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '').trim().slice(0, 20) || null
}

async function fetchNotion() {
  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  })
  const data = await res.json()
  if (data.object === 'error') throw new Error(`Notion: ${data.message}`)
  return data.results
}

async function migrate(records) {
  const client = await pool.connect()
  let ok = 0, skip = 0
  try {
    for (const page of records) {
      const p = page.properties
      const name = getTitle(p['Company Name'])
      if (!name) { skip++; continue }

      const docUrl = getUrl(p['Document URL'])
      const vals = [
        page.id,
        name,
        parseDomain(name, docUrl),
        getSelect(p['Industry Category']),
        getText(p['Platform Type']),
        getNumber(p['User Base']),
        getNumber(p['Transparency Score']),
        getSelect(p['Risk Level']),
        getNumber(p['Red Flags Count']) ?? 0,
        docUrl,
        getText(p['Public Summary']),
        getText(p['Consumer Impact']),
        getText(p['Educational Content']),
        getText(p['Quote Examples']),
        getText(p['Full ToS Text']),
        getText(p['Recent Violations']),
        getNumber(p['Regulatory Fines']),
        getMulti(p['Manipulation Tactics']),
        getSelect(p['Analysis Status']) || 'Pending',
        getSelect(p['Collection Method']),
        getDate(p['ToS Collection Date']),
        new Date().toISOString(),
      ]

      await client.query(`
        INSERT INTO companies (
          notion_id, name, domain, industry, platform_type, user_base_millions,
          transparency_score, risk_level, red_flags_count, document_url,
          public_summary, consumer_impact, educational_content, quote_examples,
          full_tos_text, recent_violations, regulatory_fines, manipulation_tactics,
          analysis_status, collection_method, tos_collection_date, last_synced_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
        ON CONFLICT (notion_id) DO UPDATE SET
          name = EXCLUDED.name, domain = EXCLUDED.domain,
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
      `, vals)

      const score = getNumber(p['Transparency Score'])
      console.log(`  ✅ ${name} — score: ${score != null ? score + '/9' : 'pending'} | ${getSelect(p['Risk Level']) || '—'}`)
      ok++
    }
  } finally {
    client.release()
  }
  return { ok, skip }
}

async function main() {
  console.log('🥗 ToS Salad — Notion → NeonDB Migration\n')

  await pool.query('SELECT 1')
  console.log('✅ Database connected\n')

  console.log('📥 Fetching from Notion...')
  const records = await fetchNotion()
  console.log(`   ${records.length} records found\n`)

  console.log('💾 Migrating...')
  const { ok, skip } = await migrate(records)

  const summary = await pool.query(
    `SELECT analysis_status, COUNT(*) as n FROM companies GROUP BY analysis_status ORDER BY n DESC`
  )
  const top = await pool.query(
    `SELECT name, transparency_score FROM companies WHERE transparency_score IS NOT NULL ORDER BY transparency_score DESC`
  )

  console.log('\n📊 Database:')
  summary.rows.forEach(r => console.log(`   ${r.analysis_status}: ${r.n}`))

  console.log('\n🏆 Rankings:')
  top.rows.forEach((r, i) => console.log(`   ${i+1}. ${r.name} — ${r.transparency_score}/9`))

  console.log(`\n✅ ${ok} migrated, ${skip} skipped`)
  await pool.end()
}

main().catch(e => { console.error('❌', e.message); pool.end(); process.exit(1) })
