import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Map-friendly event list: always returns latitude/longitude from the DB,
 * even if `prisma generate` is temporarily out of sync with the schema.
 */
export async function GET() {
  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      title: string;
      date: Date;
      location: string;
      description: string;
      image: string | null;
      latitude: number | null;
      longitude: number | null;
    }>
  >(Prisma.sql`
    SELECT id, title, date, location, description, image, latitude, longitude
    FROM events
    ORDER BY date ASC
  `);

  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date.toISOString(),
      location: r.location,
      description: r.description,
      image: r.image,
      latitude: r.latitude,
      longitude: r.longitude,
    })),
  );
}
