import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

/**
 * Server-side Supabase clients.
 * - getServerClient: authenticated per-request client using anonymous key (RLS enforced)
 * - getServiceRoleClient: admin client using service role (RLS bypassed) — NEVER expose to browser
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/**
 * Returns a server Supabase client (RLS enforced). Use in server components/routes.
 */
export function getServerClient(): SupabaseClient<Database> {
  const url = requireEnv('VITE_SUPABASE_URL')
  const anon = requireEnv('VITE_SUPABASE_ANON_KEY')
  return createClient<Database>(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'X-Client-Env': 'server',
      },
    },
  })
}

/**
 * Returns the service role client (ADMIN). Do not call this from any browser code.
 */
export function getServiceRoleClient(): SupabaseClient<Database> {
  const url = requireEnv('VITE_SUPABASE_URL')
  const serviceRole = requireEnv('VITE_SUPABASE_SERVICE_ROLE_KEY')
  return createClient<Database>(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'X-Client-Env': 'server-admin',
      },
    },
  })
}
