"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Log in"
      subtitle="Welcome back, Scout. Use the email and password for your Town Scout account."
      footer={
        <>
          No account yet?{" "}
          <Link href="/signup" className="font-semibold text-[#002D5B] hover:text-cyan-600">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-[#002D5B]">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-3 text-neutral-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-[#002D5B]">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-3 text-neutral-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
