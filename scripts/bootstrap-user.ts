/**
 * Create or update one user. Do not commit secrets — pass via env for a single run:
 *
 * PowerShell:
 *   $env:BOOTSTRAP_EMAIL="you@example.com"
 *   $env:BOOTSTRAP_NAME="Your Name"
 *   $env:BOOTSTRAP_PASSWORD="YourPassword"
 *   $env:BOOTSTRAP_ROLE="user"   # or "admin"
 *   npx tsx scripts/bootstrap-user.ts
 *
 * Requires DATABASE_URL in .env.local
 */
import { config } from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }

  const email = process.env.BOOTSTRAP_EMAIL?.toLowerCase().trim();
  const name = process.env.BOOTSTRAP_NAME?.trim() || null;
  const password = process.env.BOOTSTRAP_PASSWORD;
  const roleRaw = process.env.BOOTSTRAP_ROLE?.toLowerCase();
  const role = roleRaw === "admin" ? "admin" : "user";

  if (!email || !password) {
    console.error(
      "Set BOOTSTRAP_EMAIL, BOOTSTRAP_PASSWORD (and optionally BOOTSTRAP_NAME, BOOTSTRAP_ROLE).",
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      role,
    },
    update: {
      name,
      passwordHash,
      role,
    },
  });

  console.log(`OK: ${email} — role: ${role}. Log in at /login`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
