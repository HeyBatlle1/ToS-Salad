import { NextRequest, NextResponse } from 'next/server'
import { securityHeaders } from '@/lib/security'
import { Pool } from 'pg'

function getPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })
}

// GET /api/analyze/[id] — retrieve a user analysis
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = securityHeaders()
  const { id } = await params

  const pool = getPool()
  try {
    const result = await pool.query(
      `SELECT id, company_name, tos_url, transparency_score, risk_level,
              red_flags, summary, educational_content, consumer_impact,
              manipulation_tactics, status, created_at
       FROM user_analyses
       WHERE id = $1 AND status != 'deleted'`,
      [id]
    )
    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404, headers })
    }
    return NextResponse.json({ analysis: result.rows[0] }, { headers })
  } finally {
    await pool.end()
  }
}

// DELETE /api/analyze/[id] — soft-delete (requires delete_token)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = securityHeaders()
  const { id } = await params

  let body: { delete_token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400, headers })
  }

  if (!body.delete_token) {
    return NextResponse.json({ error: 'delete_token required' }, { status: 400, headers })
  }

  const pool = getPool()
  try {
    const result = await pool.query(
      `UPDATE user_analyses
       SET status = 'deleted'
       WHERE id = $1 AND delete_token = $2 AND status != 'deleted'
       RETURNING id`,
      [id, body.delete_token]
    )
    if (!result.rows[0]) {
      return NextResponse.json({ error: 'Not found or invalid token' }, { status: 404, headers })
    }
    return NextResponse.json({ deleted: true }, { headers })
  } finally {
    await pool.end()
  }
}
