import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";
import { createRoomSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const search = request.nextUrl.searchParams.get("search") ?? undefined;

  const where: Prisma.RoomWhereInput = {
    deletedAt: null,
    ...(status ? { status: status as never } : {}),
    ...(search
      ? {
          OR: [
            { roomNumber: { contains: search, mode: "insensitive" } },
            { currentTenantName: { contains: search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const rooms = await prisma.room.findMany({
    where,
    orderBy: { roomNumber: "asc" }
  });
  return ok(rooms);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createRoomSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid room payload", 400, parsed.error.flatten());
  }

  const room = await prisma.room.create({
    data: {
      ...parsed.data,
      monthlyRent: parsed.data.monthlyRent
    }
  });

  return created(room);
}
