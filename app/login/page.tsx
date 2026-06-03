import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in | Town Scout",
  description: "Sign in to your Town Scout account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-[#f7f9fc]" />}>
      <LoginForm />
    </Suspense>
  );
}
