import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";
import { createTenantSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const search = request.nextUrl.searchParams.get("search");
  const tenants = await prisma.tenant.findMany({
    where: {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" }
  });
  return ok(tenants);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createTenantSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid tenant payload", 400, parsed.error.flatten());
  }

  const tenant = await prisma.tenant.create({
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      profileData: (parsed.data.profileData as Prisma.InputJsonValue | undefined) ?? Prisma.JsonNull
    }
  });
  return created(tenant);
}
