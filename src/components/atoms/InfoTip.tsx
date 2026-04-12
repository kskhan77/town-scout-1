"use client";

import type { ReactNode } from "react";

type InfoTipProps = {
  children: ReactNode;
  /** Native tooltip fallback (mobile / no-hover). */
  shortTitle: string;
  /** Accessible name for the help control. */
  label?: string;
  /** Tooltip panel opens toward the map (right) in the sidebar layout. */
  side?: "right" | "bottom";
  /** Smaller “?” for tight layouts (non-embedded). */
  compact?: boolean;
  /** Sits in corner of map tab; smaller chip, paired with `tabSelected`. */
  embedded?: boolean;
  /** When `embedded`, matches active vs inactive tab styling. */
  tabSelected?: boolean;
  /** Navy gradient panel + white text (readable). Default: light panel. */
  tooltipBrand?: boolean;
};

/**
 * Small “?” control: hover/focus shows rich text; `shortTitle` for `title` fallback.
 */
export function InfoTip({
  children,
  shortTitle,
  label = "About this option",
  side = "right",
  compact = false,
  embedded = false,
  tabSelected = false,
  tooltipBrand = false,
}: InfoTipProps) {
  const hGap = embedded ? "ms-3" : "ms-2";
  const position =
    side === "right"
      ? `left-full top-1/2 z-[120] ${hGap} w-[min(20rem,calc(100vw-4rem))] -translate-y-1/2`
      : "bottom-full left-1/2 z-[120] mb-2 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2";

  const embeddedBtn = embedded
    ? tabSelected
      ? "size-5 rounded-sm rounded-br-none border border-white/45 bg-white/20 text-[10px] leading-none text-white hover:bg-white/30"
      : "size-5 rounded-sm rounded-br-none border border-slate-400/90 bg-white text-[10px] leading-none text-slate-600 hover:border-slate-500 hover:bg-slate-50"
    : "";

  const defaultBtn = !embedded
    ? compact
      ? "size-5 text-[9px] ring-1 ring-slate-200"
      : "size-7 text-xs ring-0"
    : "";

  const tooltipBrandCls = tooltipBrand
    ? "border border-white/20 bg-gradient-to-br from-[#002d5b] to-[#0c5f75] p-3.5 text-left text-sm font-normal leading-relaxed text-white shadow-2xl ring-1 ring-black/20 [&_strong]:font-semibold [&_strong]:text-cyan-200"
    : "border border-slate-200 bg-white p-2.5 text-left text-[11px] font-normal leading-snug text-slate-700 shadow-xl ring-1 ring-black/5";

  return (
    <button
      type="button"
      title={shortTitle}
      aria-label={label}
      className={`group/tip relative inline-flex shrink-0 items-center justify-center font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ccf4] focus-visible:ring-offset-1 ${
        embedded
          ? embeddedBtn
          : `rounded-full border border-slate-400/60 bg-white text-slate-600 hover:border-[#00ccf4] hover:bg-cyan-50 hover:text-[#002d5b] ${defaultBtn}`
      }`}
    >
      <span aria-hidden>?</span>
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${position} rounded-xl opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100 max-sm:hidden ${tooltipBrandCls}`}
      >
        {children}
      </span>
    </button>
  );
}
