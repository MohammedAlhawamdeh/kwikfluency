import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/app/lib/auth/supabase";
import { createSession } from "@/app/lib/auth/session";

/**
 * Auth Callback Route Handler
 *
 * This route handles authentication callbacks from Supabase for:
 * 1. Magic link authentication
 * 2. Email confirmation links
 * 3. Password reset links
 * 4. OAuth provider redirects (if implemented later)
 *
 * The route processes the authentication tokens and creates a secure session
 */

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  // Extract auth parameters from URL
  const code = searchParams.get("code");
  const access_token = searchParams.get("access_token");
  const refresh_token = searchParams.get("refresh_token");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("Auth callback received:", {
    type,
    hasCode: !!code,
    hasAccessToken: !!access_token,
    hasTokenHash: !!token_hash,
    fullUrl: request.url,
  });

  // Handle different types of auth callbacks

  // 1. Password reset links with direct tokens
  if (type === "recovery" && access_token && refresh_token) {
    console.log("Processing password reset callback with direct tokens");
    // Redirect directly to reset password page with tokens
    const resetUrl = new URL(`${origin}/reset-password`);
    resetUrl.searchParams.set("access_token", access_token);
    resetUrl.searchParams.set("refresh_token", refresh_token);
    resetUrl.searchParams.set("type", "recovery");
    return NextResponse.redirect(resetUrl.toString());
  }

  // 2. Handle token_hash for email confirmations and other flows
  if (token_hash) {
    console.log("Redirecting token_hash to confirmation handler");
    // Redirect to our confirmation handler
    const confirmUrl = new URL(`${origin}/auth/confirm`);
    confirmUrl.searchParams.set("token_hash", token_hash);
    if (type) confirmUrl.searchParams.set("type", type);
    if (next !== "/dashboard") confirmUrl.searchParams.set("next", next);
    return NextResponse.redirect(confirmUrl.toString());
  }

  // 3. Standard OAuth/magic link flow with auth code
  if (code) {
    try {
      const supabase = await createSupabaseServer();

      // Exchange the auth code for a session
      const {
        data: { user, session },
        error,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          `${origin}/login?error=auth_callback_error&message=${encodeURIComponent(
            error.message
          )}`
        );
      }

      if (!user) {
        console.error("No user returned from auth callback");
        return NextResponse.redirect(
          `${origin}/login?error=no_user&message=Authentication failed`
        );
      }

      // Create encrypted session cookie
      await createSession({
        userId: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email?.split("@")[0],
      });

      console.log("Auth callback successful for user:", user.email);

      // Handle password reset flow after successful authentication
      if (type === "recovery") {
        // Password reset flow - redirect to reset password page with tokens
        if (session?.access_token && session?.refresh_token) {
          const resetUrl = new URL(`${origin}/reset-password`);
          resetUrl.searchParams.set("access_token", session.access_token);
          resetUrl.searchParams.set("refresh_token", session.refresh_token);
          resetUrl.searchParams.set("type", "recovery");
          return NextResponse.redirect(resetUrl.toString());
        }
      }

      // Default success redirect
      const redirectUrl = next.startsWith("/")
        ? `${origin}${next}`
        : `${origin}/dashboard`;
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        `${origin}/login?error=unexpected_error&message=An unexpected error occurred`
      );
    }
  }

  // No valid parameters provided
  console.error("Auth callback called without valid parameters:", {
    code: !!code,
    access_token: !!access_token,
    token_hash: !!token_hash,
    type,
  });
  return NextResponse.redirect(
    `${origin}/login?error=missing_code&message=Invalid authentication link`
  );
}

/**
 * Handle POST requests (not typically used for auth callbacks, but included for completeness)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405, headers: { Allow: "GET" } }
  );
}
