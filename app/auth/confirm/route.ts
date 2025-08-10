import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '@/app/lib/auth/supabase'
import { createSession } from '@/app/lib/auth/session'

/**
 * Email Confirmation Route Handler
 * 
 * This route handles email confirmation links from Supabase for:
 * 1. Account signup confirmations  
 * 2. Email change confirmations
 * 3. Other email-based confirmations
 * 
 * The route processes the confirmation tokens and creates a secure session
 */

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  
  // Extract confirmation parameters from URL
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'
  
  console.log('Email confirmation received:', { 
    type, 
    hasToken: !!token_hash,
    fullUrl: request.url 
  })

  if (token_hash) {
    try {
      const supabase = await createSupabaseServer()
      
      // Clean up the type parameter in case it got URL-encoded incorrectly
      let cleanType = type
      if (type && type.includes('email')) {
        cleanType = 'email'
      }
      
      console.log('Attempting confirmation with type:', cleanType)
      
      // First try with verifyOtp using the cleaned type
      let result
      let error
      
      if (cleanType === 'email') {
        // For email confirmations, use signup type
        ({ data: result, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup'
        }))
      } else {
        // For other types, try the original approach
        ({ data: result, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: cleanType as 'signup' | 'email_change' | 'recovery' | 'invite'
        }))
      }
      
      // If verifyOtp fails, try alternative approach for PKCE tokens
      if (error && token_hash.startsWith('pkce_')) {
        console.log('Trying alternative approach for PKCE token')
        // PKCE tokens might need to be handled differently
        // Try treating it as a regular auth code
        const authCode = token_hash.replace('pkce_', '')
        const { data: authResult, error: authError } = await supabase.auth.exchangeCodeForSession(authCode)
        
        if (authError) {
          console.error('Auth code exchange failed:', authError)
          return NextResponse.redirect(`${origin}/login?error=confirmation_failed&message=${encodeURIComponent(authError.message)}`)
        }
        
        result = authResult
        error = null
      }
      
      if (error) {
        console.error('Email confirmation error:', error)
        return NextResponse.redirect(`${origin}/login?error=confirmation_failed&message=${encodeURIComponent(error.message)}`)
      }
      
      if (!result?.user) {
        console.error('No user returned from email confirmation')
        return NextResponse.redirect(`${origin}/login?error=no_user&message=Email confirmation failed`)
      }

      // Create encrypted session cookie for the confirmed user
      await createSession({
        userId: result.user.id,
        email: result.user.email!,
        name: result.user.user_metadata?.name || result.user.email?.split('@')[0],
      })

      console.log('Email confirmation successful for user:', result.user.email)
      
      // Redirect to dashboard cleanly (no query parameters)
      const redirectUrl = next.startsWith('/') ? `${origin}${next}` : `${origin}/dashboard`
      return NextResponse.redirect(redirectUrl)
      
    } catch (error) {
      console.error('Unexpected error in email confirmation:', error)
      return NextResponse.redirect(`${origin}/login?error=unexpected_error&message=An unexpected error occurred during email confirmation`)
    }
  }

  // No token provided
  console.error('Email confirmation called without token_hash parameter')
  return NextResponse.redirect(`${origin}/login?error=invalid_confirmation&message=Invalid confirmation link`)
}

/**
 * Handle POST requests (not typically used for email confirmations, but included for completeness)
 */
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' }, 
    { status: 405, headers: { Allow: 'GET' } }
  )
}
