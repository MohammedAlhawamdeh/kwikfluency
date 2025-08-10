import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './app/lib/auth/session'

/**
 * Next.js Middleware for Authentication and Route Protection
 * 
 * This middleware:
 * 1. Performs optimistic authentication checks using encrypted session cookies
 * 2. Protects routes that require authentication 
 * 3. Redirects unauthenticated users to login
 * 4. Redirects authenticated users away from auth pages
 * 5. Runs before every request for maximum security
 */

// Define route categories for different access rules
const publicRoutes = [
  '/',
  '/login',
  '/signup', 
  '/forgot-password',
  '/reset-password',
]

const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/lessons', // Add your app-specific routes here
  '/chat',
]

// Routes that authenticated users shouldn't access (redirect to dashboard)
const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  
  // Get session from encrypted cookie
  const sessionCookie = request.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null
  
  // Check if user is authenticated and session is valid
  const isAuthenticated = session && new Date() < session.expiresAt
  
  // Determine route type
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Route protection logic
  
  // 1. Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    // Add return URL for redirect after login
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // 2. Redirect authenticated users away from auth pages to dashboard
  if (isAuthRoute && isAuthenticated) {
    // Check for return URL from query params
    const returnUrl = request.nextUrl.searchParams.get('returnUrl')
    const redirectTo = returnUrl && returnUrl.startsWith('/') ? returnUrl : '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }
  
  // 3. Handle special auth routes (for magic links, OAuth, email confirmations, etc.)
  if (pathname === '/auth/callback' || pathname === '/auth/confirm') {
    // Let the auth handlers process the tokens
    return NextResponse.next()
  }
  
  // 4. For all other routes, continue normally
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Any files with extensions (e.g., .png, .jpg, .css, .js)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
