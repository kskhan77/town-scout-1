/** Spacing and sizes from Figma (MidTerm-gropu10, nodes 162:7 signup / 162:9 login). */

export const SIGNUP_GRID =
  "max-w-[1126px] lg:grid-cols-[382px_603px] lg:gap-x-[141px] lg:gap-y-10 gap-y-10";
/** Login: strict 40% / 60% columns (4fr : 6fr); top-align for hero aspect height. */
export const LOGIN_GRID =
  "max-w-[1201px] min-w-0 items-stretch gap-y-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:items-start lg:gap-x-8 xl:gap-x-10";

/** Shared by login + signup — slate border + tinted fill reads clearly on white cards. */
export const signupInputClass =
  "h-[46px] w-full rounded-lg border-2 border-slate-300 bg-white px-[13px] text-sm text-[#0f172a] shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#00ccf4] focus:ring-2 focus:ring-[#00ccf4]/25";

export const loginInputClass = signupInputClass;

export const signupLabelClass =
  "mb-1 block text-sm font-semibold text-[#334155]";

export const loginLabelClass =
  "mb-2 block text-sm font-medium text-slate-700 sm:text-base";

/** Full-width CTA in sliding auth — compact height vs legacy py-3.5. */
export const authSlidePrimaryCtaClass =
  "w-full rounded-xl bg-gradient-to-r from-[#002d5b] to-[#0e7490] py-2.5 text-sm font-semibold text-white shadow-md shadow-[#002d5b]/15 transition hover:brightness-[1.03] active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100";

/** Same gradient CTA as slide auth, for inline actions (e.g. profile save). */
export const authPrimaryCtaInlineClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#002d5b] to-[#0e7490] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#002d5b]/15 transition hover:brightness-[1.03] active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100";

/** Sliding auth: visible border + Town Scout tinted field background. */
export const authSlideInputClass =
  "h-10 w-full rounded-full border-2 border-[#002d5b]/35 bg-[#e8f6fa] px-4 text-sm text-[#0f172a] shadow-sm outline-none transition placeholder:text-slate-500 focus:border-[#00ccf4] focus:bg-white focus:ring-2 focus:ring-[#00ccf4]/30";

export const authSlideLabelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500";
