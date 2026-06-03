import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/events/:id — update an event
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { title, date, location, description, image } = body;

  const event = await prisma.event.update({
    where: { id },
    data: { title, date: new Date(date), location, description, image },
  });
  return NextResponse.json(event);
}

// DELETE /api/events/:id — delete an event
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
