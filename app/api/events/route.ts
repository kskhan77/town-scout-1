import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const event = await prisma.event.create({
    data: { title, date: new Date(date), location, description, image },
  });
  return NextResponse.json(event, { status: 201 });
}
