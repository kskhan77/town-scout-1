import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidLatLng, parseBodyCoord } from "@/lib/eventCoords";

// GET /api/events — list all events
export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

// POST /api/events — create a new event
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, date, location, description, image } = body;

  if (!title || !date || !location || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const pr = parseBodyCoord(body.latitude);
  const pg = parseBodyCoord(body.longitude);
  if (!pr.ok || !pg.ok) {
    return NextResponse.json({ error: "Invalid latitude or longitude." }, { status: 400 });
  }
  if ((pr.value === null) !== (pg.value === null)) {
    return NextResponse.json(
      { error: "Set both latitude and longitude, or leave both empty." },
      { status: 400 },
    );
  }
  let latitude: number | null = null;
  let longitude: number | null = null;
  if (pr.value !== null && pg.value !== null) {
    if (!isValidLatLng(pr.value, pg.value)) {
      return NextResponse.json({ error: "Coordinates out of range." }, { status: 400 });
    }
    latitude = pr.value;
    longitude = pg.value;
  }

  const event = await prisma.event.create({
    data: {
      title,
      date: new Date(date),
      location,
      description,
      image,
      latitude,
      longitude,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
