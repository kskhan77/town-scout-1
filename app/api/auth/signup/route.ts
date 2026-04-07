import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isFlintServiceZip, normalizeZip } from "@/lib/flint-zips";
import { getPasswordChecks, passwordMeetsPolicy } from "@/lib/signup-password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const confirmEmail =
      typeof body.confirmEmail === "string" ? body.confirmEmail.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const zipRaw = typeof body.zipCode === "string" ? body.zipCode : "";
    const zipCode = normalizeZip(zipRaw);

    const firstName = typeof body.firstName === "string" ? body.firstName.trim().slice(0, 80) : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim().slice(0, 80) : "";
    const nameFromBody = typeof body.name === "string" ? body.name.trim().slice(0, 160) : "";
    const name =
      nameFromBody ||
      [firstName, lastName].filter(Boolean).join(" ").trim().slice(0, 160) ||
      undefined;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (email !== confirmEmail) {
      return NextResponse.json({ error: "Email addresses do not match." }, { status: 400 });
    }

    const checks = getPasswordChecks(password);
    if (!passwordMeetsPolicy(checks)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include a capital letter, a number, and a special character.",
        },
        { status: 400 },
      );
    }

    if (!isFlintServiceZip(zipRaw)) {
      return NextResponse.json(
        { error: "Please use a Flint-area ZIP code we currently serve." },
        { status: 400 },
      );
    }

    if (body.role === "admin") {
      return NextResponse.json({ error: "Invalid request." }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        zipCode,
        role: "user",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("signup", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
