import 'server-only'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { SessionData } from './supabase'

// Session configuration
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days
const COOKIE_NAME = 'session'

/**
 * Get the secret key for JWT encryption
 * In production, this should be a strong, randomly generated secret
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Encrypt session data into a JWT token
 * Uses jose library for secure JWT handling with HS256 algorithm
 */
export async function encrypt(payload: SessionData): Promise<string> {
  const secret = getSecretKey()
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(payload.expiresAt))
    .sign(secret)
}

/**
 * Decrypt and verify a JWT session token
 * Returns null if token is invalid, expired, or malformed
 */
export async function decrypt(token: string | undefined): Promise<SessionData | null> {
  if (!token) return null
  
  try {
    const secret = getSecretKey()
    const { payload } = await jwtVerify(token, secret)
    
    // Validate payload structure
    if (
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.expiresAt !== 'string'
    ) {
      return null
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
      expiresAt: new Date(payload.expiresAt),
    }
  } catch (error) {
    console.error('Session decryption failed:', error)
    return null
  }
}

/**
 * Create a new session cookie
 * Sets secure, HTTP-only cookie with proper expiration
 */
export async function createSession(sessionData: Omit<SessionData, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  const session: SessionData = { ...sessionData, expiresAt }
  
  // Encrypt the session data
  const encryptedSession = await encrypt(session)
  
  // Set the cookie with security attributes
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, encryptedSession, {
    httpOnly: true, // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    expires: expiresAt,
    sameSite: 'lax', // CSRF protection while allowing normal navigation
    path: '/', // Available across the entire site
  })
  
  return session
}

/**
 * Get the current session from cookies
 * Returns null if no valid session exists
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return null
  }
  
  return await decrypt(sessionCookie.value)
}

/**
 * Update an existing session with new data
 * Maintains the same expiration time unless explicitly changed
 */
export async function updateSession(updates: Partial<SessionData>) {
  const currentSession = await getSession()
  if (!currentSession) {
    throw new Error('No active session to update')
  }
  
  const updatedSession: SessionData = {
    ...currentSession,
    ...updates,
  }
  
  const encryptedSession = await encrypt(updatedSession)
  const cookieStore = await cookies()
  
  cookieStore.set(COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: updatedSession.expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  
  return updatedSession
}

/**
 * Delete the current session cookie
 * Effectively logs out the user by removing their session
 */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Check if a session is expired
 * Useful for middleware and route protection
 */
export function isSessionExpired(session: SessionData | null): boolean {
  if (!session) return true
  return new Date() > session.expiresAt
}
