'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, sendMagicLink, type ActionResult } from '@/app/lib/auth/actions'
import { toast } from 'sonner'

/**
 * Login Page Component
 * 
 * Features:
 * - Email/password authentication
 * - Magic link option (passwordless)
 * - Form validation with real-time feedback
 * - Theme-aware styling using your design system
 * - Return URL support for post-login redirects
 * - Loading states and error handling
 */

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')

  /**
   * Handle form submission for email/password login
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    try {
      const result: ActionResult = await signIn(formData)

      if (result.success) {
        toast.success(result.message)
        
        // Trigger auth state change event
        window.dispatchEvent(new CustomEvent('auth-change'))
        
        // Redirect to return URL or dashboard
        const redirectTo = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/dashboard'
        router.push(redirectTo)
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle magic link submission
   */
  async function handleMagicLink(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    try {
      const result: ActionResult = await sendMagicLink(formData)

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Magic link error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-card rounded-lg p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 
          className="text-2xl font-bold mb-2" 
          style={{ color: 'var(--foreground)' }}
        >
          Welcome back
        </h1>
        <p 
          className="text-sm" 
          style={{ color: 'var(--auth-muted)' }}
        >
          Sign in to continue your English learning journey
        </p>
      </div>

      {!showMagicLink ? (
        /* Email/Password Form */
        <form action={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="auth-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="auth-error mt-1">{errors.email[0]}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="auth-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="auth-error mt-1">{errors.password[0]}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/forgot-password" 
              className="auth-link text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-button-primary w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="auth-spinner mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      ) : (
        /* Magic Link Form */
        <form action={handleMagicLink} className="space-y-4">
          <div>
            <label 
              htmlFor="magic-email"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Email
            </label>
            <input
              id="magic-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="auth-input w-full px-3 py-2 rounded-lg text-sm"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="auth-error mt-1">{errors.email[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-button-primary w-full py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="auth-spinner mr-2"></div>
                Sending magic link...
              </>
            ) : (
              'Send Magic Link'
            )}
          </button>
        </form>
      )}

      {/* Toggle between forms */}
      <div className="auth-divider my-6">
        <span>or</span>
      </div>

      <button
        type="button"
        onClick={() => setShowMagicLink(!showMagicLink)}
        className="auth-button-secondary w-full py-3 px-4 rounded-lg font-medium text-sm"
        disabled={isLoading}
      >
        {showMagicLink ? 'Sign in with password' : 'Sign in with magic link'}
      </button>

      {/* Sign Up Link */}
      <div className="text-center mt-6">
        <p 
          className="text-sm"
          style={{ color: 'var(--auth-muted)' }}
        >
          Don&apos;t have an account?{' '}
          <Link 
            href="/signup" 
            className="auth-link font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
