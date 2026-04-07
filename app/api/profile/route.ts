import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isFlintServiceZip, normalizeZip } from "@/lib/flint-zips";

export const runtime = "nodejs";

/** Current user profile (name, email, zip) from DB. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, zipCode: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name ?? "",
    email: user.email,
    zipCode: user.zipCode ?? "",
  });
}

/** Update display name and ZIP (Flint-area when provided). Email is not changed here. */
export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const rawName = "name" in body && typeof (body as { name: unknown }).name === "string"
    ? (body as { name: string }).name
    : undefined;
  const rawZip = "zipCode" in body && typeof (body as { zipCode: unknown }).zipCode === "string"
    ? (body as { zipCode: string }).zipCode
    : undefined;

  if (rawName === undefined && rawZip === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const data: { name?: string | null; zipCode?: string | null } = {};

  if (rawName !== undefined) {
    const name = rawName.trim().slice(0, 160);
    if (!name) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    data.name = name;
  }

  if (rawZip !== undefined) {
    const z = normalizeZip(rawZip);
    if (z.length === 0) {
      data.zipCode = null;
    } else if (!isFlintServiceZip(rawZip)) {
      return NextResponse.json(
        { error: "ZIP must be a Flint-area code we serve, or leave blank." },
        { status: 400 },
      );
    } else {
      data.zipCode = z;
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { name: true, email: true, zipCode: true },
    });

    return NextResponse.json({
      name: updated.name ?? "",
      email: updated.email,
      zipCode: updated.zipCode ?? "",
    });
  } catch {
    return NextResponse.json({ error: "Could not save profile." }, { status: 500 });
  }
}
