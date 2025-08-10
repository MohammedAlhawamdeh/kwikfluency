'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { forgotPassword, type ActionResult } from '@/app/lib/auth/actions'
import { toast } from 'sonner'

/**
 * Forgot Password Page Component
 * 
 * Features:
 * - Email input for password reset request
 * - Form validation with real-time feedback
 * - Theme-aware styling using your design system
 * - Success state showing confirmation message
 * - Loading states and error handling
 */

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')

  /**
   * Handle form submission for password reset request
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    try {
      const result: ActionResult = await forgotPassword(formData)

      if (result.success) {
        toast.success(result.message)
        setEmail(formData.get('email') as string)
        setEmailSent(true)
      } else {
        toast.error(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show success message if email was sent
  if (emailSent) {
    return (
      <div className="auth-card rounded-lg p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--auth-success)', color: 'white' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 
            className="text-2xl font-bold mb-2" 
            style={{ color: 'var(--foreground)' }}
          >
            Check your email
          </h1>
          <p 
            className="text-sm mb-2" 
            style={{ color: 'var(--auth-muted)' }}
          >
            We&apos;ve sent a password reset link to:
          </p>
          <p 
            className="text-sm font-medium mb-6"
            style={{ color: 'var(--foreground)' }}
          >
            {email}
          </p>
          <p 
            className="text-xs mb-6" 
            style={{ color: 'var(--auth-muted)' }}
          >
            If you don&apos;t see the email, check your spam folder or try again with a different email address.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setEmailSent(false)}
            className="auth-button-primary w-full py-3 px-4 rounded-lg font-medium text-sm"
          >
            Try Different Email
          </button>
          
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
          Forgot your password?
        </h1>
        <p 
          className="text-sm" 
          style={{ color: 'var(--auth-muted)' }}
        >
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      {/* Password Reset Form */}
      <form action={handleSubmit} className="space-y-6">
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
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="auth-error mt-1">{errors.email[0]}</p>
          )}
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
              Sending reset link...
            </>
          ) : (
            'Send Reset Link'
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

      {/* Security Note */}
      <div 
        className="text-xs leading-relaxed p-3 rounded-lg mt-6"
        style={{ 
          backgroundColor: 'rgba(23, 23, 23, 0.03)',
          borderLeft: '3px solid var(--auth-border)',
          color: 'var(--auth-muted)'
        }}
      >
        <strong>Security Note:</strong> If an account with this email exists, you&apos;ll receive a password reset link. 
        For security reasons, we don&apos;t reveal whether an account exists or not.
      </div>
    </div>
  )
}
