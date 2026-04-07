import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidLatLng, parseBodyCoord } from "@/lib/eventCoords";

// PUT /api/events/:id — update an event
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { title, date, location, description, image } = body;

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

  const event = await prisma.event.update({
    where: { id },
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
  return NextResponse.json(event);
}

// DELETE /api/events/:id — delete an event
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
