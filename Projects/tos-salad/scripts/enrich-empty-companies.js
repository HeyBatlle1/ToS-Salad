#!/usr/bin/env node
/**
 * Fetch ToS for companies with empty content and enrich via Gemini
 */
const { Pool } = require('pg')

const DATABASE_URL   = process.env.DATABASE_URL
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY

if (!DATABASE_URL)   { console.error('DATABASE_URL required'); process.exit(1) }
if (!GEMINI_API_KEY) { console.error('GOOGLE_GEMINI_API_KEY required'); process.exit(1) }

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 })

const TARGETS = [
  { name: 'Signal',                url: 'https://signal.org/legal/' },
  { name: 'Telegram',              url: 'https://telegram.org/tos' },
  { name: 'Microsoft Corporation', url: 'https://www.microsoft.com/en-us/servicesagreement/' },
]

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi,  '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s{3,}/g, '\n\n').trim()
}

async function fetchPage(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'ToSSalad-Transparency-Bot/1.0 (educational)' }
    })
    clearTimeout(t)
    const text = await res.text()
    return htmlToText(text).slice(0, 60000)
  } catch (e) {
    clearTimeout(t)
    throw e
  }
}

async function analyze(content, companyName) {
  const prompt = `Analyze the following Terms of Service document for ${companyName}.

Identify predatory clauses, manipulation tactics, and consumer rights concerns.
Rate transparency from 1-9 (1 = extremely predatory, 9 = fully transparent and user-friendly).

Document:
${content}

Respond ONLY with valid JSON in this exact format:
{
  "transparencyScore": <number 1-9>,
  "publicSummary": "<2-3 sentence plain English assessment for the public>",
  "educationalContent": "<3-5 sentence educational explanation of the key findings and what users should know>",
  "consumerImpact": "<2-3 sentences on how these terms specifically affect everyday users>",
  "quoteExamples": "<paste 2-3 key clauses verbatim from the document with brief explanations, using the format: Quote: [text] — Meaning: [explanation]>",
  "redFlags": [
    {
      "clause": "<exact quote>",
      "severity": "low|medium|high",
      "explanation": "<plain English>",
      "sourceSection": "<section name>"
    }
  ],
  "manipulationTactics": ["<tactic1>", "<tactic2>"]
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
      }),
    }
  )

  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  // Strip markdown code fences if present
  const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
  const match = stripped.match(/\{[\s\S]*\}/)
  return JSON.parse(match?.[0] ?? stripped)
}

async function main() {
  console.log('🥗 ToS Salad — Content Enrichment\n')

  for (const target of TARGETS) {
    console.log(`\n📄 ${target.name}`)
    console.log(`   Fetching: ${target.url}`)

    let content
    try {
      content = await fetchPage(target.url)
      console.log(`   ✅ Fetched ${content.length.toLocaleString()} chars`)
    } catch (e) {
      console.error(`   ❌ Fetch failed: ${e.message}`)
      continue
    }

    console.log(`   🤖 Running Gemini analysis...`)
    let result
    try {
      result = await analyze(content, target.name)
    } catch (e) {
      console.error(`   ❌ Gemini failed: ${e.message}`)
      continue
    }

    console.log(`   📊 Score: ${result.transparencyScore}/9 | Red flags: ${result.redFlags?.length ?? 0}`)

    // Update DB
    const client = await pool.connect()
    try {
      await client.query(`
        UPDATE companies SET
          transparency_score   = COALESCE(transparency_score, $1),
          public_summary       = $2,
          educational_content  = $3,
          consumer_impact      = $4,
          quote_examples       = $5,
          manipulation_tactics = CASE WHEN array_length(manipulation_tactics, 1) IS NULL THEN $6 ELSE manipulation_tactics END,
          last_synced_at       = NOW()
        WHERE name = $7
      `, [
        result.transparencyScore,
        result.publicSummary,
        result.educationalContent,
        result.consumerImpact,
        result.quoteExamples,
        result.manipulationTactics ?? [],
        target.name,
      ])
      console.log(`   ✅ Database updated`)
    } finally {
      client.release()
    }

    // Brief pause between Gemini calls
    await new Promise(r => setTimeout(r, 2000))
  }

  // Final check
  const check = await pool.query(`
    SELECT name, transparency_score,
           CASE WHEN coalesce(public_summary,'') <> '' THEN 'Y' ELSE 'N' END AS has_content
    FROM companies WHERE name = ANY($1)
  `, [TARGETS.map(t => t.name)])

  console.log('\n📋 Result:')
  for (const row of check.rows) {
    console.log(`   ${row.name}: score=${row.transparency_score} content=${row.has_content}`)
  }

  await pool.end()
  console.log('\n✅ Done')
}

main().catch(e => { console.error('❌', e.message); pool.end(); process.exit(1) })
