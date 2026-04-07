import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Auth.js requires a secret. In production set AUTH_SECRET in .env.local (32+ random bytes). */
function resolveAuthSecret(): string | undefined {
  const fromEnv = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") {
    return "dev-only-townscout-auth-secret-min-32-characters-long";
  }
  return undefined;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: resolveAuthSecret(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) return null;

        const email = String(emailRaw).toLowerCase().trim();
        const password = String(passwordRaw);

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
      }
      if (trigger === "update" && session?.user) {
        const u = session.user;
        if (u.name !== undefined && u.name !== null) {
          token.name = typeof u.name === "string" ? u.name : token.name;
        }
        if (u.email !== undefined && u.email !== null) {
          token.email = typeof u.email === "string" ? u.email : token.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as "user" | "admin") ?? "user";
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
});
