'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServer } from './supabase'
import { createSession, deleteSession, getSession } from './session'
import { z } from 'zod'

// Validation schemas using Zod
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Action result types
export type ActionResult<T = unknown> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

/**
 * Sign in user with email and password
 * Creates encrypted session cookie on success
 */
export async function signIn(formData: FormData): Promise<ActionResult> {
  try {
    // Validate form data
    const validatedFields = signInSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please check your input and try again',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data
    const supabase = await createSupabaseServer()

    // Attempt sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Sign in failed. Please try again.',
      }
    }

    // Create encrypted session
    await createSession({
      userId: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
    })

    // Trigger auth state change event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-change'))
    }

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Sign up new user with email and password
 * Creates encrypted session cookie on success
 */
export async function signUp(formData: FormData): Promise<ActionResult> {
  try {
    // Validate form data
    const validatedFields = signUpSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please check your input and try again',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email, password } = validatedFields.data
    const supabase = await createSupabaseServer()

    // Attempt sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: email.split('@')[0], // Default name from email
        },
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Sign up failed. Please try again.',
      }
    }

    // If email confirmation is required, don't create session yet
    if (!data.user.email_confirmed_at) {
      return {
        success: true,
        message: 'Please check your email to confirm your account before signing in.',
        data: { emailConfirmationRequired: true },
      }
    }

    // Create encrypted session for confirmed users
    await createSession({
      userId: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
    })

    return {
      success: true,
      message: 'Account created successfully',
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Send password reset email
 */
export async function forgotPassword(formData: FormData): Promise<ActionResult> {
  try {
    // Validate form data
    const validatedFields = forgotPasswordSchema.safeParse({
      email: formData.get('email'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email } = validatedFields.data
    const supabase = await createSupabaseServer()

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Reset password with new password
 * Handles both access/refresh tokens and PKCE tokens
 */
export async function resetPassword(
  formData: FormData,
  tokenOrAccess?: string,
  refreshToken?: string
): Promise<ActionResult> {
  try {
    // Validate form data
    const validatedFields = resetPasswordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please check your input and try again',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { password } = validatedFields.data
    const supabase = await createSupabaseServer()

    // Handle PKCE token for password reset
    if (tokenOrAccess?.startsWith('pkce_')) {
      console.log('Processing PKCE token for password reset')
      
      // For password reset PKCE tokens, use verifyOtp
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenOrAccess,
        type: 'recovery'
      })
      
      if (verifyError) {
        console.error('PKCE token verification error:', verifyError)
        return {
          success: false,
          message: 'Invalid or expired reset link. Please request a new one.',
        }
      }

      if (!data.session) {
        return {
          success: false,
          message: 'Failed to establish session. Please request a new reset link.',
        }
      }

      // Set the session
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })

      if (sessionError) {
        console.error('Session error:', sessionError)
        return {
          success: false,
          message: 'Invalid or expired reset link. Please request a new one.',
        }
      }
    } else if (tokenOrAccess && refreshToken) {
      // Handle regular access/refresh tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokenOrAccess,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        return {
          success: false,
          message: 'Invalid or expired reset link. Please request a new one.',
        }
      }
    } else {
      return {
        success: false,
        message: 'No valid authentication tokens provided.',
      }
    }

    // Update password
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Password reset failed. Please try again.',
      }
    }

    // Create new session with updated user
    await createSession({
      userId: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
    })

    return {
      success: true,
      message: 'Password updated successfully',
      data: { shouldTriggerAuthChange: true },
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

/**
 * Sign out current user
 * Clears session cookie and redirects to login
 */
export async function signOut(): Promise<never> {
  try {
    const supabase = await createSupabaseServer()
    
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    // Delete our session cookie
    await deleteSession()
  } catch (error) {
    console.error('Sign out error:', error)
    // Still delete local session even if Supabase call fails
    await deleteSession()
  } finally {
    // Always redirect to login after sign out
    redirect('/login')
  }
}

/**
 * Get current user session
 * Used by components to check auth status
 */
export async function getCurrentUser() {
  try {
    const session = await getSession()
    
    if (!session) {
      return null
    }
    
    // Verify session is still valid with Supabase
    const supabase = await createSupabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      // Invalid session, clean up
      await deleteSession()
      return null
    }
    
    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || session.name,
      emailVerified: !!user.email_confirmed_at,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Send magic link for passwordless login
 * Alternative authentication method
 */
export async function sendMagicLink(formData: FormData): Promise<ActionResult> {
  try {
    const validatedFields = forgotPasswordSchema.safeParse({
      email: formData.get('email'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Please enter a valid email address',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email } = validatedFields.data
    const supabase = await createSupabaseServer()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Magic link sent! Please check your email.',
    }
  } catch (error) {
    console.error('Magic link error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}
