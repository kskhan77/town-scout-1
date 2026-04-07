"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { getUserInitials } from "@/lib/userDisplay";
import {
  authPrimaryCtaInlineClass,
  authSlideInputClass,
  authSlideLabelClass,
} from "@/components/auth/authFigmaTokens";

type ProfileEditFormProps = {
  initialName: string;
  initialEmail: string;
  initialZipCode: string;
  isAdmin: boolean;
};

/** Same chrome as editable fields; cursor shows it can’t be edited here. */
const inputReadonlyClass = `${authSlideInputClass} mt-1.5 cursor-not-allowed`;
const inputEditableClass = `${authSlideInputClass} mt-1.5`;

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

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
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
          <label htmlFor="profile-name" className={authSlideLabelClass}>
            Display name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={160}
            className={inputEditableClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="profile-email" className={authSlideLabelClass}>
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            className={inputReadonlyClass}
            value={initialEmail}
            readOnly
            aria-readonly="true"
          />
        </div>

        <div>
          <label htmlFor="profile-zip" className={authSlideLabelClass}>
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
            className={inputEditableClass}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
          <p className="mt-1.5 text-xs font-medium text-[#002d5b]/80">
            Optional. Must be a ZIP we currently serve, or clear the field.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button type="submit" disabled={loading} className={authPrimaryCtaInlineClass}>
            {loading ? "Saving…" : "Save changes"}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#002d5b]/25 bg-[#e8f6fa] px-5 py-2.5 text-sm font-semibold text-[#002D5B] transition hover:border-[#00ccf4] hover:bg-white"
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
