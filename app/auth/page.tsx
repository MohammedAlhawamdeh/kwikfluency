"use client";

import AuthForm from "@/app/components/auth/AuthForm";
import { useTheme } from "@/app/components/ThemeProvider";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthPage() {
  const { theme } = useTheme();
  const bgClass = theme === "dark" ? "bg-black" : "bg-white";

  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Optionally, check for user authentication here via API call
    // If authenticated, redirect
    // Example: fetch("/api/auth/me").then(...)

    const errorParam = searchParams.get("error");
    setError(errorParam || undefined);
  }, [searchParams]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${bgClass} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to KwikFluency
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account or create a new one
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <AuthForm />
      </div>
    </div>
  );
}
