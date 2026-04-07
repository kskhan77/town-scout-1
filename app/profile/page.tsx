import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileEditForm } from "@/components/organisms/ProfileEditForm";
import { prisma } from "@/lib/prisma";
import { PAGE_SHELL } from "@/lib/pageLayout";

export const metadata: Metadata = {
  title: "Profile | Town Scout",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, zipCode: true },
  });

  if (!dbUser) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <main className="w-full bg-[#f7f9fc] py-12 md:py-16">
      <div className={PAGE_SHELL}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Account</p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#002D5B] md:text-4xl">
          Your profile
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">
          Change how your name appears in the header and keep your Flint-area ZIP up to date.
        </p>

        <ProfileEditForm
          initialName={dbUser.name?.trim() ?? ""}
          initialEmail={dbUser.email}
          initialZipCode={dbUser.zipCode ?? ""}
          isAdmin={session.user.role === "admin"}
        />
      </div>
    </main>
  );
}
