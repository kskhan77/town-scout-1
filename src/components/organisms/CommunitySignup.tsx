"use client";

import { Button } from "@/components/atoms/Button";
import { authSlideInputClass } from "@/components/auth/authFigmaTokens";
import { PAGE_SHELL, SECTION_PAD_Y } from "@/lib/pageLayout";

export function CommunitySignup() {
  return (
    <section
      className={`border-t border-slate-200/80 bg-gradient-to-br from-[#002d5b]/[0.06] via-[#f3f6fa] to-cyan-50/50 text-center ${SECTION_PAD_Y}`}
      aria-labelledby="community-signup-heading"
    >
      <div className={PAGE_SHELL}>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#0ea5c4] md:text-sm">
          Stay in the loop
        </p>
        <h2
          id="community-signup-heading"
          className="mb-4 text-3xl font-extrabold tracking-tight text-[#002d5b] md:text-4xl"
        >
          Join our local community
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-slate-600 md:mb-9 md:text-[17px] md:leading-relaxed">
          Be a Town Scout insider—get picks for events and history drops in Flint.
        </p>
        <form
          className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-3"
          action="#"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="signup-email" className="sr-only">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            className={`${authSlideInputClass} min-h-0 flex-1 sm:min-w-[16rem]`}
          />
          <Button type="submit" variant="primary" className="shrink-0 px-8 py-2.5 sm:self-auto">
            Sign up
          </Button>
        </form>
      </div>
    </section>
  );
}
