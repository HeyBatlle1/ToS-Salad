import { NextRequest, NextResponse } from 'next/server'
import { securityHeaders } from '@/lib/security'
import { Pool } from 'pg'

// POST /api/analyze/[id]/submit — mark a user analysis for curator review
export async function POST(
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
    return NextResponse.json({ error: 'delete_token required to submit' }, { status: 400, headers })
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  })

  try {
    const result = await pool.query(
      `UPDATE user_analyses
       SET status = 'pending_review'
       WHERE id = $1 AND delete_token = $2 AND status = 'active'
       RETURNING id`,
      [id, body.delete_token]
    )
    if (!result.rows[0]) {
      return NextResponse.json(
        { error: 'Not found, invalid token, or already submitted' },
        { status: 404, headers }
      )
    }
    return NextResponse.json({ submitted: true }, { headers })
  } finally {
    await pool.end()
  }
}
