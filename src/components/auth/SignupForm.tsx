"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { AuthFormShell } from "@/components/auth/AuthFormShell";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not create account.");
        setLoading(false);
        return;
      }

      const sign = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (sign?.error) {
        router.push("/login?registered=1");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Sign up"
      subtitle="Create a Town Scout account. You’ll join as a community member; admin accounts are created separately."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#002D5B] hover:text-cyan-600">
            Log in
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
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-[#002D5B]">
            Name <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-3 text-neutral-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-[#002D5B]">
            Email
          </label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-[#002D5B]">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full border border-gray-200 px-4 py-3 text-neutral-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
          />
          <p className="mt-1.5 text-xs text-neutral-500">At least 8 characters.</p>
        </div>
        <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthFormShell>
  );
}
