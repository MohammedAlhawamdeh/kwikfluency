'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPassword, type ActionResult } from '@/app/lib/auth/actions'
import { toast } from 'sonner'

/**
 * Reset Password Page Component
 * 
 * Features:
 * - New password input with confirmation
 * - URL parameter validation for reset tokens
 * - Form validation with real-time feedback
 * - Theme-aware styling using your design system
 * - Success state with redirect to dashboard
 * - Loading states and error handling
 */

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [storedTokens, setStoredTokens] = useState<{ token?: string; refreshToken?: string }>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Extract tokens from URL parameters
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  const type = searchParams.get('type')
  
  // Extract PKCE token (it's the parameter name itself, not a value)
  const pkceToken = Array.from(searchParams.keys()).find(key => key.startsWith('pkce_'))

  useEffect(() => {
    // Validate that we have the required tokens and correct type
    if (type === 'recovery' && (
      (accessToken && refreshToken) || 
      pkceToken
    )) {
      setIsValidToken(true)
      
      // Store tokens before cleaning URL
      setStoredTokens({
        token: pkceToken || accessToken || undefined,
        refreshToken: refreshToken || undefined
      })
      
      // Clean up URL by removing tokens for better UX
      const cleanUrl = new URL(window.location.href)
      cleanUrl.search = '' // Remove all query parameters
      window.history.replaceState({}, '', cleanUrl.toString())
    } else {
      setIsValidToken(false)
    }
  }, [type, accessToken, refreshToken, pkceToken])

  /**
   * Handle form submission for password reset
   */
  async function handleSubmit(formData: FormData) {
    // Use stored tokens (since URL has been cleaned)
    const tokenToUse = storedTokens.token
    
    if (!tokenToUse) {
      toast.error('Invalid reset link. Please request a new one.')
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result: ActionResult = await resetPassword(formData, tokenToUse, storedTokens.refreshToken)

      if (result.success) {
        toast.success(result.message)
        
        // Redirect to dashboard after successful password reset
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="auth-card rounded-lg p-6 sm:p-8 text-center">
        <div className="auth-spinner mx-auto mb-4"></div>
        <p style={{ color: 'var(--auth-muted)' }}>Validating reset link...</p>
      </div>
    )
  }

  // Show error state for invalid or expired tokens
  if (!isValidToken) {
    return (
      <div className="auth-card rounded-lg p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--auth-error)', color: 'white' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 
            className="text-2xl font-bold mb-2" 
            style={{ color: 'var(--foreground)' }}
          >
            Invalid Reset Link
          </h1>
          <p 
            className="text-sm mb-6" 
            style={{ color: 'var(--auth-muted)' }}
          >
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/forgot-password"
            className="auth-button-primary w-full py-3 px-4 rounded-lg font-medium text-sm inline-block text-center"
          >
            Request New Reset Link
          </Link>
          
          <Link 
            href="/login"
            className="auth-button-secondary w-full py-3 px-4 rounded-lg font-medium text-sm inline-block text-center"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-card rounded-lg p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 
          className="text-2xl font-bold mb-2" 
          style={{ color: 'var(--foreground)' }}
        >
          Set new password
        </h1>
        <p 
          className="text-sm" 
          style={{ color: 'var(--auth-muted)' }}
        >
          Enter your new password below
        </p>
      </div>

      {/* Password Reset Form */}
      <form action={handleSubmit} className="space-y-4">
        {/* New Password Field */}
        <div>
          <label 
            htmlFor="password"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            className="auth-input w-full px-3 py-2 rounded-lg text-sm"
            placeholder="Create a new password (8+ characters)"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="auth-error mt-1">{errors.password[0]}</p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div>
          <label 
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="auth-input w-full px-3 py-2 rounded-lg text-sm"
            placeholder="Confirm your new password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="auth-error mt-1">{errors.confirmPassword[0]}</p>
          )}
        </div>

        {/* Password Requirements */}
        <div 
          className="text-xs leading-relaxed p-3 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(255, 92, 0, 0.05)',
            borderLeft: '3px solid var(--vivid-orange)',
            color: 'var(--auth-muted)'
          }}
        >
          <strong>Password requirements:</strong>
          <ul className="mt-1 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Should contain a mix of letters and numbers</li>
            <li>• Avoid using common words or personal information</li>
          </ul>
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
              Updating password...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>

      {/* Back to Sign In */}
      <div className="text-center mt-6">
        <Link 
          href="/login" 
          className="auth-link text-sm"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}
