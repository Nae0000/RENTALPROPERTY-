import { NextRequest } from "next/server";
import { CalendarEventType, Prisma } from "@prisma/client";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const createCalendarEventSchema = z.object({
  roomId: z.string().optional(),
  title: z.string().min(1),
  eventType: z.nativeEnum(CalendarEventType),
  eventDate: z.string().datetime(),
  status: z.string().default("PENDING"),
  metadata: z.record(z.unknown()).optional()
});

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const month = Number(request.nextUrl.searchParams.get("month"));
  const year = Number(request.nextUrl.searchParams.get("year"));

  const hasPeriod = Number.isFinite(month) && Number.isFinite(year);
  const start = hasPeriod ? new Date(year, month - 1, 1) : undefined;
  const end = hasPeriod ? new Date(year, month, 0, 23, 59, 59) : undefined;

  const events = await prisma.calendarEvent.findMany({
    where: hasPeriod ? { eventDate: { gte: start, lte: end } } : undefined,
    orderBy: { eventDate: "asc" }
  });
  return ok(events);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createCalendarEventSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid calendar payload", 400, parsed.error.flatten());
  }

  const data: Prisma.CalendarEventUncheckedCreateInput = {
    roomId: parsed.data.roomId ?? null,
    title: parsed.data.title,
    eventType: parsed.data.eventType,
    eventDate: new Date(parsed.data.eventDate),
    status: parsed.data.status,
    metadata: (parsed.data.metadata as Prisma.InputJsonValue | undefined) ?? Prisma.JsonNull
  };

  const event = await prisma.calendarEvent.create({ data });
  return created(event);
}
