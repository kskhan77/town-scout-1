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
  /** Use `div` when nested under a parent `<main>` (e.g. sliding auth layout). */
  rootElement?: "main" | "div";
  /** Lighter chrome when inside the sliding auth card (gradient page behind). */
  variant?: "standalone" | "slider";
  /**
   * Right-hand column only: no outer card chrome, full width (Stitch “sliding body” panel).
   * Parent supplies hero + toggle.
   */
  embeddedSlide?: boolean;
}

export function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
  leading,
  layoutVariant,
  rootElement = "main",
  variant = "standalone",
  embeddedSlide = false,
}: AuthFormShellProps) {
  const gridClass = leading
    ? layoutVariant === "signup"
      ? SIGNUP_GRID
      : layoutVariant === "login"
        ? LOGIN_GRID
        : "max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]"
    : "";

  const cardClass = embeddedSlide
    ? "w-full border-0 bg-transparent p-0 shadow-none"
    : layoutVariant === "signup"
      ? "w-full max-w-[603px] rounded-2xl border border-[#e2e8f0] bg-white px-10 pb-10 pt-9 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]"
      : layoutVariant === "login"
        ? "w-full max-w-lg rounded-2xl border border-[#e2e8f0] bg-white px-5 py-8 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)] sm:px-8 sm:py-10 lg:max-w-none"
        : "rounded-2xl border border-[#e2e8f0] bg-white px-8 py-10 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]";

  const titleClass =
    embeddedSlide && layoutVariant === "login"
      ? "mt-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]"
      : embeddedSlide && layoutVariant === "signup"
        ? "mt-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
        : layoutVariant === "login"
          ? "mt-0 text-3xl font-medium leading-tight tracking-tight text-[#111] sm:text-4xl sm:leading-tight md:text-5xl lg:text-[56px] lg:leading-[1.15]"
          : layoutVariant === "signup"
            ? "mt-2 text-[28px] font-semibold leading-7 tracking-tight text-[#111]"
            : "mt-2 text-2xl font-black uppercase tracking-tight text-[#002D5B] md:text-3xl";

  const subtitleWrapClass =
    embeddedSlide && layoutVariant === "login"
      ? "mt-1.5 text-sm leading-relaxed text-slate-500"
      : layoutVariant === "login"
        ? "mt-6 text-base leading-snug sm:mt-8 sm:text-lg lg:mt-10 lg:text-xl lg:leading-6"
        : embeddedSlide && layoutVariant === "signup"
          ? "mt-1.5 text-sm leading-relaxed text-slate-500"
          : "mt-2 text-sm leading-5";

  const bodyTopClass =
    embeddedSlide && layoutVariant === "login"
      ? "mt-5"
      : layoutVariant === "login"
        ? "mt-8 sm:mt-10 lg:mt-14"
        : embeddedSlide && layoutVariant === "signup"
          ? "mt-5"
          : layoutVariant === "signup"
            ? "mt-10"
            : "mt-8";

  const backClass = embeddedSlide
    ? "mb-3 inline-block text-xs font-semibold text-[#002D5B] hover:text-cyan-600"
    : "mb-6 inline-block text-sm font-semibold text-[#002D5B] hover:text-cyan-600 sm:mb-8";

  const shellBody = (
    <>
      <Link href="/" className={backClass}>
        ← Back to home
      </Link>
      <div className={cardClass}>
        {layoutVariant !== "login" ? (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00ccf4]">Town Scout</p>
        ) : null}
        <h1 className={titleClass}>{title}</h1>
        <div
          className={`${subtitleWrapClass} ${layoutVariant === "login" && !embeddedSlide ? "text-[#555]" : ""} ${layoutVariant === "signup" && !embeddedSlide ? "text-neutral-600" : ""}`}
        >
          {subtitle}
        </div>
        <div className={bodyTopClass}>{children}</div>
        <div
          className={`text-center text-neutral-600 ${embeddedSlide ? "mt-6 border-t border-slate-200/70 pt-4 text-xs leading-relaxed" : "mt-8 border-t border-[#eef2f6] pt-6 text-sm"}`}
        >
          {footer}
        </div>
      </div>
    </>
  );

  const rootClass =
    variant === "slider"
      ? embeddedSlide
        ? "w-full bg-transparent py-0"
        : "w-full bg-transparent py-6 sm:py-8 md:py-10"
      : "w-full bg-[#f7f9fc] py-10 sm:py-14 md:py-20";

  const authGrid = (
    <div className={`mx-auto grid min-w-0 w-full justify-items-stretch ${gridClass}`}>
      <div className="order-2 min-w-0 w-full lg:order-1">
        <div className="mx-auto w-full min-w-0 max-w-lg lg:mx-0 lg:max-w-none">{leading}</div>
      </div>
      <div className="order-1 min-w-0 w-full lg:order-2">
        <div className="mx-auto w-full min-w-0 max-w-lg lg:mx-0 lg:max-w-none">{shellBody}</div>
      </div>
    </div>
  );

  const inner = embeddedSlide ? (
    <div className="mx-auto w-full max-w-md px-0">{shellBody}</div>
  ) : (
    <div className={PAGE_SHELL}>
      {leading ? (
        variant === "slider" ? (
          <div className="rounded-2xl bg-slate-100/95 p-4 ring-1 ring-slate-200/70 sm:p-5 lg:p-8">
            {authGrid}
          </div>
        ) : (
          authGrid
        )
      ) : (
        <div className="mx-auto max-w-md">{shellBody}</div>
      )}
    </div>
  );

  if (rootElement === "div") {
    return <div className={rootClass}>{inner}</div>;
  }

  return <main className={rootClass}>{inner}</main>;
}
