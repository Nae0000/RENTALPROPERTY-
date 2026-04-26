import { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const createLeaseSchema = z.object({
  roomId: z.string().min(1),
  tenantId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  monthlyRent: z.number().positive(),
  securityAmount: z.number().nonnegative()
});

export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const leases = await prisma.leaseContract.findMany({
    include: { room: true, tenant: true },
    orderBy: { createdAt: "desc" }
  });
  return ok(leases);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createLeaseSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid lease payload", 400, parsed.error.flatten());
  }

  const activeLease = await prisma.leaseContract.findFirst({
    where: { roomId: parsed.data.roomId, status: "ACTIVE" }
  });
  if (activeLease) {
    return fail("ROOM_ALREADY_OCCUPIED", "Room already has an active lease", 409);
  }

  const lease = await prisma.leaseContract.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate)
    }
  });
  return created(lease);
}
