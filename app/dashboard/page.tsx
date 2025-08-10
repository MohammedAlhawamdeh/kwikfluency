import React from 'react'
import { getCurrentUser } from '@/app/lib/auth/actions'
import { redirect } from 'next/navigation'

// Success message component for email confirmations
function SuccessMessage({ message }: { message: string }) {
  return (
    <div 
      className="mb-8 p-4 rounded-lg"
      style={{ 
        backgroundColor: 'var(--auth-success)',
        color: 'white'
      }}
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </div>
  )
}

/**
 * Dashboard Page
 * 
 * This is a protected route that shows the user's dashboard after authentication.
 * It demonstrates how to:
 * 1. Get the current user on the server side
 * 2. Handle unauthenticated users
 * 3. Display user-specific content
 */

export default async function DashboardPage() {
  // Get the current user from our session system
  const user = await getCurrentUser()
  
  // This shouldn't happen due to middleware, but good to have as backup
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            Welcome back, {user.name || 'there'}!
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--auth-muted)' }}
          >
            Ready to continue your English learning journey?
          </p>
        </div>

        {/* User Info Card */}
        <div 
          className="auth-card rounded-lg p-6 mb-8"
          style={{ maxWidth: '500px' }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Account Information
          </h2>
          
          <div className="space-y-3">
            <div>
              <label 
                className="text-sm font-medium"
                style={{ color: 'var(--auth-muted)' }}
              >
                Email
              </label>
              <p 
                className="text-sm mt-1"
                style={{ color: 'var(--foreground)' }}
              >
                {user.email}
              </p>
            </div>
            
            <div>
              <label 
                className="text-sm font-medium"
                style={{ color: 'var(--auth-muted)' }}
              >
                Email Status
              </label>
              <div className="flex items-center mt-1">
                <div 
                  className={`w-2 h-2 rounded-full mr-2 ${
                    user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <p 
                  className="text-sm"
                  style={{ color: 'var(--foreground)' }}
                >
                  {user.emailVerified ? 'Verified' : 'Pending verification'}
                </p>
              </div>
            </div>
            
            <div>
              <label 
                className="text-sm font-medium"
                style={{ color: 'var(--auth-muted)' }}
              >
                User ID
              </label>
              <p 
                className="text-xs mt-1 font-mono"
                style={{ color: 'var(--auth-muted)' }}
              >
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Start Learning Card */}
          <div className="auth-card rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: 'var(--vivid-orange)', color: 'white' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Start Learning
              </h3>
            </div>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--auth-muted)' }}
            >
              Begin your personalized English lessons with AI-powered coaching
            </p>
            <button 
              className="auth-button-primary px-4 py-2 rounded-lg text-sm font-medium"
              disabled
            >
              Coming Soon
            </button>
          </div>

          {/* Practice Chat Card */}
          <div className="auth-card rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: 'var(--vivid-orange)', color: 'white' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Practice Chat
              </h3>
            </div>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--auth-muted)' }}
            >
              Practice conversational English with our AI conversation partner
            </p>
            <button 
              className="auth-button-primary px-4 py-2 rounded-lg text-sm font-medium"
              disabled
            >
              Coming Soon
            </button>
          </div>

          {/* Progress Tracking Card */}
          <div className="auth-card rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: 'var(--vivid-orange)', color: 'white' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 
                className="text-lg font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Your Progress
              </h3>
            </div>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--auth-muted)' }}
            >
              Track your learning progress and achievements
            </p>
            <button 
              className="auth-button-primary px-4 py-2 rounded-lg text-sm font-medium"
              disabled
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div 
          className="mt-8 p-6 rounded-lg"
          style={{ 
            backgroundColor: 'rgba(255, 92, 0, 0.05)',
            borderLeft: '4px solid var(--vivid-orange)'
          }}
        >
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--foreground)' }}
          >
            🎉 Welcome to KwikFluency!
          </h3>
          <p 
            className="text-sm"
            style={{ color: 'var(--auth-muted)' }}
          >
            Your authentication system is now fully set up and working! You&apos;re signed in securely with encrypted session cookies. 
            The learning features are coming soon - stay tuned for AI-powered English lessons tailored just for you.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Metadata for the dashboard page
 */
export const metadata = {
  title: 'Dashboard - KwikFluency',
  description: 'Your personalized English learning dashboard',
}
