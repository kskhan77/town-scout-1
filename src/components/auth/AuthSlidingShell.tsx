"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

const track =
  "flex w-[200%] flex-row transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0";

const panel =
  "w-1/2 min-w-[50%] max-w-[50%] shrink-0 basis-1/2 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable]";

const pillBase =
  "flex-1 rounded-full px-5 py-2 text-center text-[13px] font-semibold transition duration-200 sm:flex-none sm:min-w-[7.5rem]";

const pillActive =
  "bg-gradient-to-r from-[#002d5b] to-[#0e9fbc] text-white shadow-md shadow-[#002d5b]/30 ring-1 ring-[#002d5b]/15";

const pillInactive =
  "bg-cyan-50/80 text-[#002d5b]/85 hover:bg-cyan-100/80 hover:text-[#002d5b]";

/**
 * Stitch-style sliding auth: soft branded left column + compact form column.
 */
export function AuthSlidingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";

  return (
    <>
      <main className="flex min-h-dvh items-center justify-center overflow-x-hidden bg-[#f0f4f8] p-4 md:p-6 lg:p-8">
        <div className="grid min-h-[min(600px,90dvh)] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-20px_rgba(0,45,91,0.22)] ring-1 ring-slate-200/60 lg:min-h-[min(720px,88dvh)] lg:grid-cols-2">
          {/* Left: full hero image + overlay; same copy as before, readable on photo */}
          <div className="relative hidden min-h-0 overflow-hidden lg:flex lg:h-full lg:flex-col lg:justify-between">
            <Image
              src="/images/login-hero.png"
              alt="Downtown Flint — aerial view"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 0"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#002d5b]/94 via-[#002d5b]/55 to-[#002d5b]/25"
              aria-hidden
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-9 xl:p-11">
              <div>
                <p className="text-sm font-bold tracking-tight text-cyan-200/95">Town Scout</p>
                <h2 className="mt-10 max-w-[20rem] text-3xl font-extrabold leading-[1.12] tracking-tight text-white xl:max-w-[22rem] xl:text-[2.15rem]">
                  Preserving the <span className="text-cyan-300">Soul</span> of Our Streets.
                </h2>
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/90">
                  Join neighbors and local historians documenting the stories behind Flint&apos;s places,
                  events, and heritage.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-white/25 bg-white/15 p-5 shadow-lg shadow-black/10 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-400/25 text-lg text-cyan-100 ring-1 ring-white/30"
                    aria-hidden
                  >
                    ◎
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">Community spotlight</p>
                    <p className="mt-0.5 text-xs font-medium text-white/70">Exploring Flint together</p>
                    <p className="mt-3 text-sm italic leading-snug text-white/85">
                      &ldquo;Town Scout helped our block connect events and history in one place.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: toggle + sliding forms — narrow column, comfortable padding */}
          <div className="flex min-h-0 min-w-0 flex-col justify-center bg-white px-7 py-9 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
            <nav
              className="mb-6 flex w-full justify-center sm:justify-start"
              aria-label="Choose sign in or sign up"
            >
              <div className="flex w-full max-w-[19rem] rounded-full bg-slate-200/60 p-1 ring-1 ring-slate-300/50 sm:max-w-none sm:w-auto">
                <Link
                  href="/login"
                  aria-current={!isSignup ? "page" : undefined}
                  className={`${pillBase} ${!isSignup ? pillActive : pillInactive}`}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  aria-current={isSignup ? "page" : undefined}
                  className={`${pillBase} ${isSignup ? pillActive : pillInactive}`}
                >
                  Create account
                </Link>
              </div>
            </nav>

            <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
              <div className={track} style={{ transform: isSignup ? "translateX(-50%)" : "translateX(0)" }}>
                <div
                  className={panel}
                  aria-hidden={isSignup}
                  {...(isSignup ? { inert: true } : {})}
                >
                  <Suspense
                    fallback={
                      <div className="flex min-h-[240px] items-center justify-center" aria-hidden>
                        <span className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
                      </div>
                    }
                  >
                    <LoginForm shellRoot="div" embeddedInSlideCard />
                  </Suspense>
                </div>
                <div
                  className={panel}
                  aria-hidden={!isSignup}
                  {...(!isSignup ? { inert: true } : {})}
                >
                  <SignupForm shellRoot="div" embeddedInSlideCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="sr-only" aria-hidden>
        {children}
      </div>
    </>
  );
}
