import { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const updateTenantSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(8).optional()
});

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const parsed = updateTenantSchema.safeParse(await request.json());
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid tenant update payload", 400, parsed.error.flatten());
  }

  const updated = await prisma.tenant.update({
    where: { id: params.id },
    data: parsed.data
  });

  return ok(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const existing = await prisma.tenant.findUnique({ where: { id: params.id } });
  if (!existing) return fail("NOT_FOUND", "Tenant not found", 404);

  await prisma.tenant.update({
    where: { id: params.id },
    data: { deletedAt: new Date() }
  });
  return ok({ deleted: true });
}
