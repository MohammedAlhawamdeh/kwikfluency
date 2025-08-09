"use client";

import Link from "next/link";
import { useTransition } from "react";
import { signOut } from "@/app/lib/actions/auth";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/app/lib/context/AuthContext";
import Spinner from "@/app/components/icons/Spinner";

interface AuthButtonClientProps {
  user: User | null;
}

export default function AuthButtonClient({
  user: serverUser,
}: AuthButtonClientProps) {
  const [isPending, startTransition] = useTransition();
  const { user: clientUser, loading } = useAuth();

  // Use client-side user if available, otherwise fall back to server-side user
  const user = clientUser ?? serverUser;

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="px-4 py-2 text-sm font-medium text-gray-400 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block truncate max-w-[150px]">
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors disabled:opacity-50"
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  ) : (
    <Link
      href="/auth"
      className="px-4 py-2 text-sm font-medium text-white bg-[var(--vivid-orange)] hover:bg-amber-700 rounded-full transition-colors"
    >
      Sign In
    </Link>
  );
}
