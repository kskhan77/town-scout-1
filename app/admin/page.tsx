import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PAGE_SHELL } from "@/lib/pageLayout";

export const metadata: Metadata = {
  title: "Admin | Town Scout",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }
  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="w-full bg-[#f7f9fc] py-14 md:py-20">
      <div className={PAGE_SHELL}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Admin</p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Signed in as <strong>{session.user.email}</strong>. Add admin-only tools and analytics here.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-[#002D5B] hover:text-cyan-600"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
}
