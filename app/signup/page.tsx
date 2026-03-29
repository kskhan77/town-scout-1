import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up | Town Scout",
  description: "Create a Town Scout community account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
