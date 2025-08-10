'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp, type ActionResult } from '@/app/lib/auth/actions'
import { toast } from 'sonner'

/**
 * Signup Page Component
 * 
 * Features:
 * - Email/password registration
 * - Password confirmation validation
 * - Form validation with real-time feedback
 * - Theme-aware styling using your design system
 * - Email confirmation handling
 * - Loading states and error handling
 */

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false)
  
  const router = useRouter()

  /**
   * Handle form submission for user registration
   */
  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setErrors({})

    try {
      const result: ActionResult = await signUp(formData)

      if (result.success) {
        toast.success(result.message)
        
        // Check if email confirmation is required
        if (result.data && typeof result.data === 'object' && 'emailConfirmationRequired' in result.data) {
          setEmailConfirmationRequired(true)
        } else {
          // User is automatically signed in, redirect to dashboard
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        toast.error(result.message)
        if (result.errors) {
          setErrors(result.errors)
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show email confirmation message if required
  if (emailConfirmationRequired) {
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
            className="text-sm mb-6" 
            style={{ color: 'var(--auth-muted)' }}
          >
            We&apos;ve sent you a confirmation link. Please check your email and click the link to activate your account.
          </p>
        </div>
        
        <Link 
          href="/login"
          className="auth-button-primary inline-block py-3 px-6 rounded-lg font-medium text-sm"
        >
          Go to Sign In
        </Link>
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
          Create your account
        </h1>
        <p 
          className="text-sm" 
          style={{ color: 'var(--auth-muted)' }}
        >
          Start your English learning journey with AI-powered lessons
        </p>
      </div>

      {/* Registration Form */}
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
            autoComplete="new-password"
            className="auth-input w-full px-3 py-2 rounded-lg text-sm"
            placeholder="Create a password (8+ characters)"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="auth-error mt-1">{errors.password[0]}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label 
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            className="auth-input w-full px-3 py-2 rounded-lg text-sm"
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="auth-error mt-1">{errors.confirmPassword[0]}</p>
          )}
        </div>

        {/* Terms and Privacy Notice */}
        <div 
          className="text-xs leading-relaxed p-3 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(255, 92, 0, 0.05)',
            borderLeft: '3px solid var(--vivid-orange)',
            color: 'var(--auth-muted)'
          }}
        >
          By creating an account, you agree to our terms of service and privacy policy. 
          We&apos;ll use your email to send you learning progress updates and important account information.
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
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="text-center mt-6">
        <p 
          className="text-sm"
          style={{ color: 'var(--auth-muted)' }}
        >
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="auth-link font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
