import { NextRequest } from "next/server";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const createPaymentSchema = z.object({
  rentInvoiceId: z.string().min(1),
  paidAmount: z.number().positive(),
  method: z.string().min(1),
  referenceNo: z.string().optional(),
  note: z.string().optional()
});

export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payments = await prisma.paymentTransaction.findMany({
    include: { rentInvoice: true },
    orderBy: { paidAt: "desc" }
  });
  return ok(payments);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createPaymentSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid payment payload", 400, parsed.error.flatten());
  }

  const invoice = await prisma.rentInvoice.findUnique({
    where: { id: parsed.data.rentInvoiceId }
  });
  if (!invoice) {
    return fail("INVOICE_NOT_FOUND", "Invoice not found", 404);
  }

  const payment = await prisma.paymentTransaction.create({
    data: {
      ...parsed.data,
      paidAt: new Date()
    }
  });

  const totalPaid = await prisma.paymentTransaction.aggregate({
    _sum: { paidAmount: true },
    where: { rentInvoiceId: invoice.id }
  });
  const paidAmount = Number(totalPaid._sum.paidAmount ?? 0);
  const invoiceAmount = Number(invoice.amount);

  await prisma.rentInvoice.update({
    where: { id: invoice.id },
    data: {
      status: paidAmount >= invoiceAmount ? "PAID" : "PARTIAL",
      paidAt: paidAmount >= invoiceAmount ? new Date() : null
    }
  });

  return created(payment);
}
