import AuthForm from "@/app/components/auth/AuthForm";
import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/actions/auth";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Check if user is already authenticated
  const user = await getUser();
  if (user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to KwikFluency
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account or create a new one
          </p>
        </div>

        {params?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {params.error}
          </div>
        )}

        <AuthForm />
      </div>
    </div>
  );
}
