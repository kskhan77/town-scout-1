/** Spacing and sizes from Figma (MidTerm-gropu10, nodes 162:7 signup / 162:9 login). */

export const SIGNUP_GRID =
  "max-w-[1126px] lg:grid-cols-[382px_603px] lg:gap-x-[141px] lg:gap-y-10 gap-y-10";
/** Login: hero ~40%, form ~60%; top-align so hero keeps natural aspect height. */
export const LOGIN_GRID =
  "max-w-[1201px] items-stretch gap-y-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-x-[61px]";

/** Shared by login + signup — slate border + tinted fill reads clearly on white cards. */
export const signupInputClass =
  "h-[46px] w-full rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-[13px] text-sm text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#00ccf4] focus:ring-1 focus:ring-[#00ccf4]/40";

export const loginInputClass = signupInputClass;

export const signupLabelClass =
  "mb-1 block text-sm font-semibold text-[#334155]";

export const loginLabelClass =
  "mb-2 block text-sm font-medium text-slate-700 sm:text-base";
