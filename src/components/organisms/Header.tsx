"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { NavLink } from "@/components/atoms/NavLink";
import { HeaderProfileMenu } from "@/components/molecules/HeaderProfileMenu";
import { MobileNavSheet } from "@/components/molecules/MobileNavSheet";
import { PAGE_SHELL } from "@/lib/pageLayout";

const linkPrimary =
  "inline-flex items-center justify-center rounded-full bg-[#00D1FF] px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#00B8E6] active:scale-95";
const linkOutline =
  "inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:text-[#00D1FF] active:scale-95";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="flex size-5 flex-col items-center justify-center gap-[5px]">
      <span
        className={`block h-0.5 w-5 origin-center rounded-full bg-[#002D5B] transition ${open ? "translate-y-[7px] rotate-45" : ""}`}
      />
      <span
        className={`block h-0.5 w-5 rounded-full bg-[#002D5B] transition ${open ? "scale-0 opacity-0" : "opacity-100"}`}
      />
      <span
        className={`block h-0.5 w-5 origin-center rounded-full bg-[#002D5B] transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export const Header = () => {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <div className={`${PAGE_SHELL} flex items-center justify-between gap-2 py-3 sm:gap-4 md:py-4`}>
        <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none md:shrink-0">
          <Link href="/" className="min-w-0 shrink" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.svg"
              alt="Town Scout"
              width={300}
              height={55}
              className="h-9 w-auto max-w-[152px] object-contain object-left sm:h-10 sm:max-w-[180px] md:h-11 md:max-w-[220px]"
              priority
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/history">History</NavLink>
          <NavLink href="/explore">Explore</NavLink>
          {session?.user?.role === "admin" ? (
            <NavLink href="/admin">Admin</NavLink>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {status === "loading" ? (
            <span
              className="flex h-10 w-24 animate-pulse items-center gap-2 rounded-full bg-neutral-100 sm:w-36"
              aria-hidden
            />
          ) : session?.user ? (
            <HeaderProfileMenu user={session.user} />
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/login" className={linkOutline}>
                Login
              </Link>
              <Link href="/signup" className={linkPrimary}>
                Signup
              </Link>
            </div>
          )}

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#002D5B] shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-sheet"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <MobileNavSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        session={session ?? null}
        status={status}
      />
    </header>
  );
};
