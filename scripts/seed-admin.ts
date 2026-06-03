/**
 * Create or update the bootstrap admin user (PostgreSQL via Prisma).
 *
 * Usage (from project root):
 *   npm run seed:admin
 *
 * Requires in .env.local:
 *   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE
 *   ADMIN_EMAIL=admin@example.com
 *   ADMIN_PASSWORD=your-secure-password
 */

import { config } from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!databaseUrl || !email || !password) {
    console.error(
      "Missing env: set DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD in .env.local",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        name: "Admin",
        role: "admin",
      },
    });
    console.log(`Admin user created: ${email}`);
  } else {
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log(`Admin user updated (password reset, role admin): ${email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
