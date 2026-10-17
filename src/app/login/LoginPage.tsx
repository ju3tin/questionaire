
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2">
            Timed<span className="text-blue-600">Q</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to create and control questionnaires
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
            Continue with Facebook
          </button>
          <button
            onClick={() => signIn("linkedin", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            <img
              src="https://www.svgrepo.com/show/448234/linkedin.svg"
              alt="LinkedIn"
              className="w-5 h-5"
            />
            Continue with LinkedIn
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
