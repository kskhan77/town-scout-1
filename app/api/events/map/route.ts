import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { fetchTicketmasterMapEvents } from "@/lib/externalEvents/ticketmaster";
import { prisma } from "@/lib/prisma";
import type { MapEventPoint } from "@/lib/mapEventPoint";

/**
 * Map-friendly events: Prisma rows (your listings) + optional Ticketmaster shows near Flint.
 * Set TICKETMASTER_API_KEY in .env.local (Discovery API consumer key).
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

  const dbPoints: MapEventPoint[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    date: r.date.toISOString(),
    location: r.location,
    description: r.description,
    image: r.image,
    latitude: r.latitude,
    longitude: r.longitude,
    source: "db",
    url: null,
  }));

  let tmPoints: MapEventPoint[] = [];
  const tmKey = process.env.TICKETMASTER_API_KEY?.trim();
  if (tmKey) {
    try {
      tmPoints = await fetchTicketmasterMapEvents(tmKey);
    } catch {
      tmPoints = [];
    }
  }

  return NextResponse.json([...dbPoints, ...tmPoints]);
}
