"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/atoms/Button";
import { NavLink } from "@/components/atoms/NavLink";
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {status === "loading" ? (
            <span className="h-9 w-20 animate-pulse rounded-full bg-gray-100" aria-hidden />
          ) : session?.user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-gray-600 sm:inline">
                {session.user.name || session.user.email}
              </span>
              {session.user.role === "admin" ? (
                <span className="rounded-full bg-[#002D5B] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Admin
                </span>
              ) : null}
              <div
                className="size-9 shrink-0 rounded-full border-2 border-white bg-[#00D1FF] shadow-sm"
                aria-hidden
              />
              <Button
                variant="outline"
                type="button"
                className="text-xs"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </div>
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
