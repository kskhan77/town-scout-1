"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { NavLink } from "@/components/atoms/NavLink";
import { HeaderProfileMenu } from "@/components/molecules/HeaderProfileMenu";
import { PAGE_SHELL } from "@/lib/pageLayout";

const linkPrimary =
  "inline-flex items-center justify-center rounded-full bg-[#00D1FF] px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#00B8E6] active:scale-95";
const linkOutline =
  "inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:text-[#00D1FF] active:scale-95";

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white/95 shadow-sm backdrop-blur-md">
      <div className={`${PAGE_SHELL} flex items-center justify-between gap-4 py-3.5 md:py-4`}>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="shrink-0">
            <Image src="/logo.svg" alt="Town Scout Logo" width={200} height={35} />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/history">History</NavLink>
          {session?.user?.role === "admin" ? (
            <NavLink href="/admin">Admin</NavLink>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {status === "loading" ? (
            <span
              className="flex h-10 w-36 animate-pulse items-center gap-2 rounded-full bg-neutral-100"
              aria-hidden
            />
          ) : session?.user ? (
            <HeaderProfileMenu user={session.user} />
          ) : (
            <>
              <Link href="/login" className={linkOutline}>
                Login
              </Link>
              <Link href="/signup" className={linkPrimary}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
