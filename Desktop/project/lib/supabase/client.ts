import { createClient, SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

/**
 * Browser Supabase client singleton with auth helpers.
 * Ensures a single instance across HMR boundaries.
 */

/**
 * Validate required public environment variables at runtime in development.
 */
function validatePublicEnv(): void {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) {
    const message = 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Configure your .env.local.'
    if (import.meta.env.MODE !== 'production') {
      throw new Error(message)
    }
  }
}

/**
 * Require secure context for security-sensitive operations.
 */
function requireSecureContext(): void {
  if (!isSecureContext) {
    throw new Error('Application requires secure context (HTTPS)');
  }
  
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.href = 'https://' + location.host + location.pathname;
  }
  
  // Additional security checks
  if (location.hostname === 'localhost' && location.port !== '3000' && location.port !== '5173') {
    console.warn('Running on non-standard localhost port - security may be compromised');
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __supabase_browser__: SupabaseClient<Database> | undefined
}

/**
 * Create a new browser client instance.
 */
function createBrowserClient(): SupabaseClient<Database> {
  validatePublicEnv()
  requireSecureContext()
  const url = import.meta.env.VITE_SUPABASE_URL as string
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  return createClient<Database>(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // Prevent token leakage in URLs
      storage: {
        // Custom secure storage implementation
        getItem: (key) => {
          try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (error) {
            console.error('Failed to store auth data:', error);
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch (error) {
            console.error('Failed to remove auth data:', error);
          }
        }
      }
    },
    global: {
      headers: {
        'X-Client-Env': 'browser',
        'X-Client-Version': '1.0.0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      },
    },
  })
}

/**
 * Returns a singleton Supabase browser client.
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient() can only be called in the browser')
  }
  if (!globalThis.__supabase_browser__) {
    globalThis.__supabase_browser__ = createBrowserClient()
  }
  return globalThis.__supabase_browser__
}

/**
 * Auth helper: sign in with email and password.
 */
export async function signInWithEmailPassword(params: {
  email: string
  password: string
}): Promise<{ session: Session | null; error: Error | null }> {
  const client = getSupabaseClient()
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: params.email,
      password: params.password,
    })
    if (error) return { session: null, error }
    return { session: data.session, error: null }
  } catch (err) {
    return { session: null, error: err as Error }
  }
}

/**
 * Auth helper: sign in with magic link (OTP).
 */
export async function signInWithMagicLink(params: {
  email: string
}): Promise<{ error: Error | null }> {
  const client = getSupabaseClient()
  try {
    const { error } = await client.auth.signInWithOtp({
      email: params.email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    if (error) return { error }
    return { error: null }
  } catch (err) {
    return { error: err as Error }
  }
}

/**
 * Auth helper: sign out current user safely.
 */
export async function signOutSafely(): Promise<{ error: Error | null }> {
  const client = getSupabaseClient()
  try {
    const { error } = await client.auth.signOut()
    if (error) return { error }
    return { error: null }
  } catch (err) {
    return { error: err as Error }
  }
}

/**
 * Auth helper: returns the current session if present.
 */
export async function getCurrentSession(): Promise<{ session: Session | null; error: Error | null }> {
  const client = getSupabaseClient()
  try {
    const { data, error } = await client.auth.getSession()
    if (error) return { session: null, error }
    return { session: data.session, error: null }
  } catch (err) {
    return { session: null, error: err as Error }
  }
}

/**
 * Subscribes to auth state changes. Returns an unsubscribe function.
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  const client = getSupabaseClient()
  const { data } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return () => {
    data.subscription.unsubscribe()
  }
}
