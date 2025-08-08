import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

/**
 * Middleware for protected routes: verifies session, refreshes if needed,
 * and enforces simple role-based access using `profiles` joins as needed.
 *
 * Usage (Next.js): export { middleware } from '@/lib/supabase/middleware'
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

/**
 * Define protected path prefixes and role constraints.
 * Adjust arrays as needed per app routes.
 */
const PROTECTED_PATHS: string[] = ['/app', '/dashboard', '/projects']
const THERAPIST_ONLY_PATHS: string[] = ['/therapist']

function isPathProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some((p) => pathname.startsWith(p))
}

function isTherapistOnly(pathname: string): boolean {
  return THERAPIST_ONLY_PATHS.some((p) => pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  const res = NextResponse.next()

  // Create a client bound to the request's auth cookies (if using cookie-based auth)
  const supabase = createClient<Database>(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
    cookies: {
      get: (key: string) => req.cookies.get(key)?.value,
      set: (key: string, value: string, options: any) => {
        res.cookies.set({ name: key, value, ...options })
      },
      remove: (key: string, options: any) => {
        res.cookies.set({ name: key, value: '', ...options })
      },
    },
  })

  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Enforce auth for protected paths
  if (isPathProtected(pathname)) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('redirectedFrom', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Simple RBAC gate for therapist-only areas
  if (session && isTherapistOnly(pathname)) {
    const userId = session.user.id
    // therapist exists if user is a therapist
    const { data: therapist, error } = await supabase
      .from('therapists')
      .select('therapist_user_id, verified')
      .eq('therapist_user_id', userId)
      .maybeSingle()

    if (error || !therapist || !therapist.verified) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Auto refresh token if expiring; supabase-js handles with autoRefreshToken=true.
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/public).*)'],
}


