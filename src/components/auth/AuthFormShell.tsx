import type { ReactNode } from "react";
import Link from "next/link";
import { PAGE_SHELL } from "@/lib/pageLayout";

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthFormShell({ title, subtitle, children, footer }: AuthFormShellProps) {
  return (
    <main className="w-full bg-[#f7f9fc] py-14 md:py-20">
      <div className={PAGE_SHELL}>
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="mb-8 inline-block text-sm font-semibold text-[#002D5B] hover:text-cyan-600"
          >
            ← Back to home
          </Link>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white px-8 py-10 shadow-[0_20px_50px_-24px_rgba(0,45,91,0.2)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Town Scout</p>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#002D5B] md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 border-t border-[#eef2f6] pt-6 text-center text-sm text-neutral-600">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
