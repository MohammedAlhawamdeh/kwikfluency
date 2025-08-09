"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a code parameter (from email confirmation)
    const code = searchParams.get("code");

    if (code) {
      // Redirect to the callback route with the code
      router.push(`/auth/callback?code=${code}`);
    }
  }, [router, searchParams]);

  return <></>;
}
