import type { ReactNode } from "react";
import Link from "next/link";
import { PAGE_SHELL } from "@/lib/pageLayout";
import { LOGIN_GRID, SIGNUP_GRID } from "@/components/auth/authFigmaTokens";

export type AuthLayoutVariant = "signup" | "login";

interface AuthFormShellProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  /** Optional column shown beside the form on large screens (e.g. signup artwork). */
  leading?: ReactNode;
  /** Figma-accurate grid: signup 382 + 603 + 141 gap; login 662 + 432 + 61 gap. */
  layoutVariant?: AuthLayoutVariant;
}

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
  leading,
  layoutVariant,
}: AuthFormShellProps) {
  const gridClass = leading
    ? layoutVariant === "signup"
      ? SIGNUP_GRID
      : layoutVariant === "login"
        ? LOGIN_GRID
        : "max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]"
    : "";

  const cardClass =
    layoutVariant === "signup"
      ? "w-full max-w-[603px] rounded-2xl border border-[#e2e8f0] bg-white px-10 pb-10 pt-9 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]"
      : layoutVariant === "login"
        ? "w-full max-w-lg rounded-2xl border border-[#e2e8f0] bg-white px-5 py-8 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)] sm:px-8 sm:py-10 lg:max-w-none"
        : "rounded-2xl border border-[#e2e8f0] bg-white px-8 py-10 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]";

  const titleClass =
    layoutVariant === "login"
      ? "mt-0 text-3xl font-medium leading-tight tracking-tight text-[#111] sm:text-4xl sm:leading-tight md:text-5xl lg:text-[56px] lg:leading-[1.15]"
      : layoutVariant === "signup"
        ? "mt-2 text-[28px] font-semibold leading-7 tracking-tight text-[#111]"
        : "mt-2 text-2xl font-black uppercase tracking-tight text-[#002D5B] md:text-3xl";

  const subtitleWrapClass =
    layoutVariant === "login"
      ? "mt-6 text-base leading-snug sm:mt-8 sm:text-lg lg:mt-10 lg:text-xl lg:leading-6"
      : "mt-2 text-sm leading-5";

  const bodyTopClass =
    layoutVariant === "login"
      ? "mt-8 sm:mt-10 lg:mt-14"
      : layoutVariant === "signup"
        ? "mt-10"
        : "mt-8";

  const shellBody = (
    <>
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-semibold text-[#002D5B] hover:text-cyan-600 sm:mb-8"
      >
        ← Back to home
      </Link>
      <div className={cardClass}>
        {layoutVariant !== "login" ? (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ccf4]">Town Scout</p>
        ) : null}
        <h1 className={titleClass}>{title}</h1>
        <div
          className={`${subtitleWrapClass} ${layoutVariant === "login" ? "text-[#555]" : "text-neutral-600"}`}
        >
          {subtitle}
        </div>
        <div className={bodyTopClass}>{children}</div>
        <div className="mt-8 border-t border-[#eef2f6] pt-6 text-center text-sm text-neutral-600">
          {footer}
        </div>
      </div>
    </>
  );

  return (
    <main className="w-full bg-[#f7f9fc] py-10 sm:py-14 md:py-20">
      <div className={PAGE_SHELL}>
        {leading ? (
          <div className={`mx-auto grid w-full justify-items-stretch ${gridClass}`}>
            <div className="order-2 w-full lg:order-1">
              <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">{leading}</div>
            </div>
            <div className="order-1 w-full lg:order-2">
              <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none">{shellBody}</div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md">{shellBody}</div>
        )}
      </div>
    </main>
  );
}
