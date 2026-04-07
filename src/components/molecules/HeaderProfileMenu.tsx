"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { getUserInitials } from "@/lib/userDisplay";

type HeaderProfileMenuProps = {
  user: NonNullable<Session["user"]>;
};

export function HeaderProfileMenu({ user }: HeaderProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initials = getUserInitials(user.name, user.email);
  const displayName = user.name?.trim() || "Member";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white py-1 pl-1 pr-2.5 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/50 md:pr-3"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00ccf4] to-[#0099cc] text-xs font-bold tracking-tight text-white shadow-inner ring-2 ring-white"
          aria-hidden
        >
          {initials}
        </span>
        <span className="hidden max-w-[120px] truncate text-left text-sm font-semibold text-[#002D5B] sm:block">
          {displayName}
        </span>
        <svg
          className={`hidden size-3.5 shrink-0 text-neutral-500 transition-transform sm:block ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-[60] mt-2 w-[min(100vw-1.5rem,17rem)] origin-top-right rounded-2xl border border-[#e2e8f0] bg-white py-2 shadow-[0_16px_48px_-12px_rgba(0,45,91,0.25)] ring-1 ring-black/[0.04]"
          role="menu"
          aria-label="Account"
        >
          <div className="border-b border-neutral-100 px-4 pb-3 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Signed in</p>
            <p className="mt-1 truncate text-sm font-bold text-[#002D5B]">{displayName}</p>
            {user.email ? (
              <p className="mt-0.5 truncate text-xs text-neutral-500">{user.email}</p>
            ) : null}
            {user.role === "admin" ? (
              <span className="mt-2 inline-block rounded-full bg-[#002D5B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Admin
              </span>
            ) : null}
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              role="menuitem"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#002D5B] transition hover:bg-cyan-50"
              onClick={() => setOpen(false)}
            >
              <span className="text-neutral-400" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              Edit profile
            </Link>
            {user.role === "admin" ? (
              <Link
                href="/admin"
                role="menuitem"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#002D5B] transition hover:bg-cyan-50"
                onClick={() => setOpen(false)}
              >
                <span className="text-neutral-400" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6v6H9z" />
                  </svg>
                </span>
                Admin
              </Link>
            ) : null}
          </div>

          <div className="border-t border-neutral-100 pt-1">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
            >
              <span className="text-red-400" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
