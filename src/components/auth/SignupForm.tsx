"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useMemo, useState } from "react";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import {
  signupInputClass,
  signupLabelClass,
} from "@/components/auth/authFigmaTokens";
import { isFlintServiceZip, normalizeZip } from "@/lib/flint-zips";
import {
  getPasswordChecks,
  passwordMeetsPolicy,
  passwordStrengthLabel,
} from "@/lib/signup-password";

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${ok ? "text-emerald-700" : "text-neutral-400"}`}
    >
      <span
        className={`flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full text-[8px] leading-none ${ok ? "bg-emerald-500 text-white" : "border border-neutral-300 bg-white text-transparent"}`}
        aria-hidden
      >
        ✓
      </span>
      {label}
    </span>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => getPasswordChecks(password), [password]);
  const strength = passwordStrengthLabel(checks);
  const zipNorm = normalizeZip(zipCode);
  const zipOk = zipNorm.length === 0 ? null : isFlintServiceZip(zipCode);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    const em2 = confirmEmail.trim().toLowerCase();
    if (em !== em2) {
      setError("Email addresses do not match.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!passwordMeetsPolicy(checks)) {
      setError("Password does not meet all requirements below.");
      return;
    }
    if (!isFlintServiceZip(zipCode)) {
      setError("Please enter a Flint-area ZIP code we currently serve.");
      return;
    }

    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name,
          email: em,
          confirmEmail: em2,
          password,
          zipCode: normalizeZip(zipCode),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not create account.");
        setLoading(false);
        return;
      }

      const sign = await signIn("credentials", {
        email: em,
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

  const filledBars = Object.values(checks).filter(Boolean).length;

  return (
    <AuthFormShell
      layoutVariant="signup"
      title="Create your account"
      subtitle="Join the community and explore Flint, MI."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#e63746] hover:underline">
            Sign in
          </Link>
        </>
      }
      leading={
        <div className="relative hidden w-full max-w-[382px] lg:block">
          <div
            className="relative w-full overflow-hidden rounded-[27px] border border-black/25 bg-white shadow-[9px_11px_17.6px_2px_rgba(0,0,0,0.25)]"
            style={{ aspectRatio: "382 / 354" }}
          >
            <Image
              src="/images/signup-hero.png"
              alt="Michigan map highlighting Flint — Town Scout"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 382px, 100vw"
              priority
            />
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-first" className={signupLabelClass}>
              First Name
            </label>
            <input
              id="signup-first"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              className={signupInputClass}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="signup-last" className={signupLabelClass}>
              Last Name
            </label>
            <input
              id="signup-last"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              className={signupInputClass}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className={signupLabelClass}>
            Email Address
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@email.com"
            className={signupInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-email-confirm" className={signupLabelClass}>
            Confirm Email Address
          </label>
          <input
            id="signup-email-confirm"
            name="confirmEmail"
            type="email"
            autoComplete="email"
            required
            placeholder="Re-enter your email"
            className={signupInputClass}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className={`${signupLabelClass} mb-2`}>
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={signupInputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-neutral-600">Strength</span>
              <span
                className={`text-xs font-bold ${
                  filledBars >= 4
                    ? "text-emerald-600"
                    : filledBars >= 2
                      ? "text-[#e63746]"
                      : "text-neutral-500"
                }`}
              >
                {password.length ? strength : "—"}
              </span>
            </div>
            <div className="flex gap-1" role="presentation" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-sm transition-colors ${
                    i < filledBars ? "bg-[#00ccf4]" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              <CheckRow ok={checks.minLength} label="8+ chars" />
              <CheckRow ok={checks.hasSpecial} label="1 special" />
              <CheckRow ok={checks.hasUpper} label="1 capital" />
              <CheckRow ok={checks.hasNumber} label="1 number" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="signup-password-confirm" className={signupLabelClass}>
            Confirm Password
          </label>
          <input
            id="signup-password-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className={signupInputClass}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="rounded-lg border border-[rgba(230,55,70,0.1)] bg-[rgba(0,204,244,0.2)] p-[17px]">
          <label htmlFor="signup-zip" className={signupLabelClass}>
            Location (Zip Code)
          </label>
          <input
            id="signup-zip"
            name="zipCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            required
            maxLength={10}
            placeholder="48501"
            className={`${signupInputClass} bg-white`}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            aria-invalid={zipOk === false}
            aria-describedby="signup-zip-hint"
          />
          <p id="signup-zip-hint" className="mt-2 text-xs font-medium text-[#e63746]">
            Currently serving Flint, MI zip codes
          </p>
          {zipOk === false ? (
            <p className="mt-1 text-xs text-red-700">That ZIP is outside our current Flint-area service.</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[46px] w-full items-center justify-center rounded-lg bg-[#00ccf4] text-sm font-bold text-white transition hover:bg-[#00b8e6] disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthFormShell>
  );
}
