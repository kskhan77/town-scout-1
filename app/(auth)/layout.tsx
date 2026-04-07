import { AuthSlidingShell } from "@/components/auth/AuthSlidingShell";

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <AuthSlidingShell>{children}</AuthSlidingShell>;
}
