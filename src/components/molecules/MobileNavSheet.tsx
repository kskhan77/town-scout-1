"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

/** Close menu after navigation is scheduled (sync onClose unmounts portal and can cancel Link clicks). */
function closeAfterNavigate(onClose: () => void) {
  window.setTimeout(() => onClose(), 0);
}

type MobileNavSheetProps = {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
};

const mainLinks: { href: string; label: string; hint: string }[] = [
  { href: "/", label: "Home", hint: "Landmarks & stories" },
  { href: "/events", label: "Events", hint: "Map & calendar" },
  { href: "/history", label: "History", hint: "Archives on the map" },
];

export function MobileNavSheet({ open, onClose, session, status }: MobileNavSheetProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  function go(href: string) {
    router.push(href);
    closeAfterNavigate(onClose);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const panel = (
    <div
      id="mobile-nav-sheet"
      className="fixed inset-0 z-[200] flex flex-col md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="relative flex h-full min-h-0 flex-col bg-gradient-to-b from-[#001a33] via-[#002d5b] to-[#020617] shadow-2xl">
        {/* Decorative mesh + grid (unique texture, no extra assets) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,204,244,0.35), transparent),
              radial-gradient(circle at 100% 0%, rgba(0,209,255,0.12), transparent 45%),
              linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 100%)
            `,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden
        />

        {/* Top bar */}
        <div
          className="relative z-[2] flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300/90">
            Town Scout
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            aria-label="Close menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Hero strip — Flint archive photo */}
        <div className="relative z-[2] mx-4 h-36 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-lg sm:h-40">
          <Image
            src="/historic/history-of-flint.jpg"
            alt=""
            fill
            className="object-cover object-center saturate-[0.85]"
            sizes="100vw"
            priority={false}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#001a33] via-[#002d5b]/55 to-transparent"
            aria-hidden
          />
          <p className="absolute bottom-3 left-4 right-4 text-sm font-semibold leading-snug text-white drop-shadow-md">
            Explore Flint — events, history, and community in one place.
          </p>
        </div>

        {/* Primary navigation — large, high contrast */}
        <nav
          className="relative z-[2] flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 py-5"
          aria-label="Main navigation"
        >
          <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">
            Go to
          </p>
          {mainLinks.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className="group flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white backdrop-blur-sm transition hover:border-cyan-400/40 hover:bg-cyan-500/15 active:scale-[0.99]"
            >
              <span>
                <span className="block text-lg font-bold tracking-tight">{item.label}</span>
                <span className="mt-0.5 block text-xs font-medium text-cyan-100/70">{item.hint}</span>
              </span>
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-cyan-300 transition group-hover:bg-cyan-400/25 group-hover:text-white"
                aria-hidden
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </button>
          ))}
          {session?.user?.role === "admin" ? (
            <button
              type="button"
              onClick={() => go("/admin")}
              className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-left text-amber-50 transition hover:bg-amber-500/20"
            >
              <span className="text-lg font-bold">Admin</span>
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                Staff
              </span>
            </button>
          ) : null}
        </nav>

        {/* Account — glass dock */}
        <div
          className="relative z-[2] shrink-0 border-t border-white/10 bg-black/25 px-4 py-4 backdrop-blur-xl"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {status === "loading" ? (
            <div className="h-20 animate-pulse rounded-2xl bg-white/10" />
          ) : session?.user ? (
            <div className="space-y-3">
              <p className="truncate px-1 text-xs text-cyan-100/60">
                Signed in as{" "}
                <span className="font-semibold text-white">{session.user.email}</span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => go("/profile")}
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-cyan-400 px-4 text-sm font-bold text-[#002d5b] shadow-lg shadow-cyan-900/30 transition hover:bg-cyan-300"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-red-400/40 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                  onClick={() => {
                    onClose();
                    void signOut({ callbackUrl: "/" });
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => go("/login")}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => go("/signup")}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-cyan-400 px-4 text-sm font-bold text-[#002d5b] shadow-lg transition hover:bg-cyan-300"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
