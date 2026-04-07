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
        ? "w-full max-w-[432px] rounded-2xl border border-[#e2e8f0] bg-white py-10 pl-[17px] pr-5 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]"
        : "rounded-2xl border border-[#e2e8f0] bg-white px-8 py-10 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]";

  const titleClass =
    layoutVariant === "login"
      ? "mt-0 text-[56px] font-medium leading-[70px] tracking-tight text-[#111]"
      : layoutVariant === "signup"
        ? "mt-2 text-[28px] font-semibold leading-7 tracking-tight text-[#111]"
        : "mt-2 text-2xl font-black uppercase tracking-tight text-[#002D5B] md:text-3xl";

  const subtitleWrapClass =
    layoutVariant === "login" ? "mt-[49px] text-xl leading-6" : "mt-2 text-sm leading-5";

  const bodyTopClass =
    layoutVariant === "login" ? "mt-14" : layoutVariant === "signup" ? "mt-10" : "mt-8";

  const shell = (
    <>
      <Link
        href="/"
        className="mb-8 inline-block text-sm font-semibold text-[#002D5B] hover:text-cyan-600"
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
    <main className="w-full bg-[#f7f9fc] py-14 md:py-20">
      <div className={PAGE_SHELL}>
        {leading ? (
          <div className={`mx-auto grid w-full justify-items-center lg:justify-items-stretch ${gridClass}`}>
            <div className="order-2 flex w-full justify-center lg:order-1 lg:justify-start">
              {leading}
            </div>
            <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-start">
              {shell}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md">{shell}</div>
        )}
      </div>
    </main>
  );
}
