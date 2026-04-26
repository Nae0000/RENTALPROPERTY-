import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";
import { createInvoiceSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const status = request.nextUrl.searchParams.get("status") ?? undefined;
  const month = request.nextUrl.searchParams.get("month");
  const year = request.nextUrl.searchParams.get("year");

  const where: Prisma.RentInvoiceWhereInput = {
    ...(status ? { status: status as never } : {}),
    ...(month ? { billingMonth: Number(month) } : {}),
    ...(year ? { billingYear: Number(year) } : {})
  };

  const invoices = await prisma.rentInvoice.findMany({
    where,
    include: { room: true, tenant: true, payments: true },
    orderBy: { dueDate: "asc" }
  });
  return ok(invoices);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createInvoiceSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid invoice payload", 400, parsed.error.flatten());
  }

  const invoice = await prisma.rentInvoice.create({
    data: {
      ...parsed.data,
      dueDate: new Date(parsed.data.dueDate),
      amount: parsed.data.amount
    }
  });
  return created(invoice);
}
