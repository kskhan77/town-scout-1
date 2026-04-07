"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { getUserInitials } from "@/lib/userDisplay";

type ProfileEditFormProps = {
  initialName: string;
  initialEmail: string;
  initialZipCode: string;
  isAdmin: boolean;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-[#002D5B] shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100";
const labelClass = "text-sm font-semibold text-[#334155]";

export function ProfileEditForm({
  initialName,
  initialEmail,
  initialZipCode,
  isAdmin,
}: ProfileEditFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [name, setName] = useState(initialName);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initials = getUserInitials(name || null, initialEmail);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        zipCode,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      name?: string;
      email?: string;
      zipCode?: string;
    };

    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not save changes.");
      return;
    }

    if (data.name !== undefined) setName(data.name);
    if (data.zipCode !== undefined) setZipCode(data.zipCode);
    setSaved(true);

    await update({
      user: {
        name: data.name ?? name.trim(),
        email: data.email ?? initialEmail,
      },
    });

    router.refresh();
  }

  return (
    <div className="mt-10 max-w-lg rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-sm md:p-8">
      <div className="flex items-start gap-4 border-b border-neutral-100 pb-6">
        <span
          className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ccf4] to-[#0099cc] text-lg font-bold text-white shadow-inner ring-4 ring-cyan-100"
          aria-hidden
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[#002D5B]">Edit profile</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Update your display name and ZIP. Email is your sign-in address and can’t be changed here yet.
          </p>
          {isAdmin ? (
            <span className="mt-3 inline-block rounded-full bg-[#002D5B] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Admin
            </span>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Profile saved.
          </p>
        ) : null}

        <div>
          <label htmlFor="profile-name" className={labelClass}>
            Display name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={160}
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={labelClass}>
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            className={`${inputClass} cursor-not-allowed bg-neutral-50 text-neutral-600`}
            value={initialEmail}
            readOnly
            aria-readonly="true"
          />
        </div>

        <div>
          <label htmlFor="profile-zip" className={labelClass}>
            ZIP code (Flint area)
          </label>
          <input
            id="profile-zip"
            name="zipCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            placeholder="48502 or leave blank"
            className={inputClass}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Optional. Must be a ZIP we currently serve, or clear the field.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#00ccf4] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#00b8e6] disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save changes"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-[#002D5B] transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            Cancel
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full bg-[#002D5B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003d75]"
            >
              Admin
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}
