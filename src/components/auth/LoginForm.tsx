"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import {
  authSlideInputClass,
  authSlideLabelClass,
  authSlidePrimaryCtaClass,
  loginInputClass,
  loginLabelClass,
} from "@/components/auth/authFigmaTokens";
import Link from "next/link";

type LoginFormProps = {
  shellRoot?: "main" | "div";
  embeddedInSlideCard?: boolean;
};

export function LoginForm({ shellRoot = "main", embeddedInSlideCard = false }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inSlide = embeddedInSlideCard;
  const inputC = inSlide ? authSlideInputClass : loginInputClass;
  const labelC = inSlide ? authSlideLabelClass : loginLabelClass;

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
      rootElement={shellRoot}
      variant={shellRoot === "div" ? "slider" : "standalone"}
      embeddedSlide={embeddedInSlideCard}
      layoutVariant="login"
      title={inSlide ? "Welcome back" : "Sign in"}
      subtitle={
        inSlide ? (
          <span className="font-normal">Continue exploring events and heritage in Flint.</span>
        ) : (
          <>
            <span className="font-normal">New user? </span>
            <Link href="/signup" className="font-medium text-[#111] hover:underline">
              Create an account
            </Link>
          </>
        )
      }
      footer={
        <span className={inSlide ? "text-neutral-500" : "text-xs text-neutral-500"}>
          {inSlide ? (
            <>
              By continuing, you agree to Town Scout&apos;s{" "}
              <span className="font-semibold text-[#002d5b]">Terms</span> and{" "}
              <span className="font-semibold text-[#002d5b]">Privacy</span> expectations for community use.
            </>
          ) : (
            "Use the email and password for your Town Scout account."
          )}
        </span>
      }
      leading={
        embeddedInSlideCard ? undefined : (
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
        )
      }
    >
      <form onSubmit={handleSubmit} className={`w-full ${inSlide ? "space-y-4" : ""}`}>
        {error ? (
          <p
            className={`rounded-lg border border-red-200 bg-red-50 text-sm text-red-800 ${inSlide ? "mb-1 px-3 py-2" : "mb-6 px-4 py-3"}`}
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="login-email" className={labelC}>
            {inSlide ? "Email or username" : "Username or Email*"}
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={inSlide ? "you@example.com" : "john@gmail.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputC}
          />
        </div>

        {inSlide ? (
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <label htmlFor="login-password" className={`${authSlideLabelClass} mb-0`}>
                Password
              </label>
              <button
                type="button"
                className="shrink-0 text-xs font-semibold text-[#0d9488] hover:text-[#0f766e] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputC}
            />
          </div>
        ) : (
          <div className="mt-8">
            <label htmlFor="login-password" className={labelC}>
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
              className={inputC}
            />
          </div>
        )}

        {!inSlide ? (
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
        ) : (
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="login-remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-3.5 rounded border-slate-300 text-cyan-500 accent-cyan-500 focus:ring-cyan-400/30"
            />
            <label htmlFor="login-remember" className="cursor-pointer text-xs text-slate-500">
              Remember me for 30 days
            </label>
          </div>
        )}

        {inSlide ? (
          <div className="pt-1">
            <button type="submit" disabled={loading} className={authSlidePrimaryCtaClass}>
              {loading ? "…" : "Sign in to Town Scout"}
            </button>
          </div>
        ) : (
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
        )}
      </form>
    </AuthFormShell>
  );
}
