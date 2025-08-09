'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, signUp, signInWithGoogle } from '@/app/lib/actions/auth'
import GoogleIcon from '../icons/Google'
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@/app/lib/validations/auth'
import { toast } from 'sonner'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isPending, startTransition] = useTransition()

  const signInForm = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signUpForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleSignIn = (data: SignInInput) => {
    startTransition(async () => {
      const result = await signIn(data)
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  const handleSignUp = (data: SignUpInput) => {
    startTransition(async () => {
      const result = await signUp(data)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success) {
        toast.success(result.message)
        setIsSignUp(false)
        signInForm.setValue('email', data.email)
      }
    })
  }

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      const result = await signInWithGoogle()
      if (result?.error) {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8">
        <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 pb-4 text-sm font-medium transition-colors ${
              !isSignUp
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            disabled={isPending}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 pb-4 text-sm font-medium transition-colors ${
              isSignUp
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
            disabled={isPending}
          >
            Sign Up
          </button>
        </div>

        {!isSignUp ? (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                {...signInForm.register('email')}
                type="email"
                id="signin-email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="you@example.com"
                disabled={isPending}
              />
              {signInForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{signInForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                {...signInForm.register('password')}
                type="password"
                id="signin-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                disabled={isPending}
              />
              {signInForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{signInForm.formState.errors.password.message}</p>
              )}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => window.location.href = '/auth/forgot-password'}
                  disabled={isPending}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-6">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                {...signUpForm.register('name')}
                type="text"
                id="signup-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="John Doe"
                disabled={isPending}
              />
              {signUpForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{signUpForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                {...signUpForm.register('email')}
                type="email"
                id="signup-email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="you@example.com"
                disabled={isPending}
              />
              {signUpForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                {...signUpForm.register('password')}
                type="password"
                id="signup-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                disabled={isPending}
              />
              {signUpForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                {...signUpForm.register('confirmPassword')}
                type="password"
                id="signup-confirm-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
                disabled={isPending}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isPending}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}
