import { createServerClient } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Environment variable validation
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

/**
 * Server-side Supabase client
 * Used in Server Components, Route Handlers, and Server Actions
 * Automatically handles cookie-based session management
 */
export async function createSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Client-side Supabase client
 * Used in Client Components for real-time subscriptions and client-side auth
 */
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Type definitions for our auth system
 */
export type AuthUser = {
  id: string
  email: string
  name?: string
  emailVerified: boolean
}

export type SessionData = {
  userId: string
  email: string
  name?: string
  expiresAt: Date
}
