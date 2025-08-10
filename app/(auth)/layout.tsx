import React from 'react'

/**
 * Authentication Layout
 * 
 * This layout wraps all authentication pages (/login, /signup, etc.)
 * and provides:
 * 1. Consistent styling and structure
 * 2. Theme-aware background
 * 3. Centered card layout optimized for forms
 * 4. Responsive design for all screen sizes
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}

/**
 * Metadata for all auth pages
 * SEO optimization for authentication flows
 */
export const metadata = {
  title: 'Authentication - KwikFluency',
  description: 'Sign in or create an account to start learning English with AI',
  robots: 'noindex, nofollow', // Don't index auth pages
}
