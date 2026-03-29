import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma generates code under node_modules/.prisma — Turbopack must not bundle it
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
