import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in | Town Scout",
  description: "Sign in to your Town Scout account.",
};

/** UI is rendered by `AuthSlidingShell` in the parent layout (shared with /signup). */
export default function LoginPage() {
  return null;
}
