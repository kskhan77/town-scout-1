"use client";

import { Button } from "@/components/atoms/Button";
import { PAGE_SHELL } from "@/lib/pageLayout";

export function CommunitySignup() {
  return (
    <section
      className="border-t border-[#e8ecf1] bg-white py-16 text-center md:py-20"
      aria-labelledby="community-signup-heading"
    >
      <div className={PAGE_SHELL}>
      <h2
        id="community-signup-heading"
        className="mb-4 text-3xl font-bold text-[#002D5B]"
      >
        Join Our Local Community
      </h2>
      <p className="mx-auto mb-8 max-w-lg text-neutral-600">
        Be a Town Scout insider—get picks for events and history drops in Flint.
      </p>
      <form
        className="mx-auto flex max-w-md flex-col justify-center gap-2 sm:flex-row"
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
          className="px-4 py-2 border border-gray-200 rounded-full w-full outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
        />
        <Button type="submit" variant="primary" className="shrink-0 px-8">
          Sign up
        </Button>
      </form>
      </div>
    </section>
  );
}
