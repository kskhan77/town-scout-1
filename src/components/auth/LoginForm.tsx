"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { loginInputClass, loginLabelClass } from "@/components/auth/authFigmaTokens";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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
      layoutVariant="login"
      title="Sign in"
      subtitle={
        <>
          <span className="font-normal">New user? </span>
          <Link href="/signup" className="font-medium text-[#111] hover:underline">
            Create an account
          </Link>
        </>
      }
      footer={
        <span className="text-xs text-neutral-500">
          Use the email and password for your Town Scout account.
        </span>
      }
      leading={
        <div className="relative w-full">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-md sm:rounded-[27px] sm:shadow-[9px_11px_17.6px_2px_rgba(0,0,0,0.2)]"
            style={{ aspectRatio: "662 / 534" }}
          >
            <Image
              src="/images/login-hero.png"
              alt="Downtown Flint — aerial view"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 90vw, 100vw"
              priority
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="w-full">
        {error ? (
          <p
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div>
          <label htmlFor="login-email" className={loginLabelClass}>
            Username or Email*
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="john@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={loginInputClass}
          />
        </div>
        <div className="mt-8">
          <label htmlFor="login-password" className={loginLabelClass}>
            Password*
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="•••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={loginInputClass}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 sm:text-base">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 shrink-0 rounded border border-slate-300 text-cyan-500 accent-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 sm:size-5"
            />
            Remember me
          </label>
        </div>
        <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            className="text-base font-medium text-[#111] hover:underline"
          >
            Forgot Password?
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-11 min-w-[6.5rem] shrink-0 items-center justify-center rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-500 disabled:opacity-60"
          >
            {loading ? "…" : "Login"}
          </button>
        </div>
      </form>
    </AuthFormShell>
  );
}
