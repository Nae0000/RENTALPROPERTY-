import { startOfMonth } from "date-fns";
import { NextRequest } from "next/server";
import { requireSession } from "@/server/auth";
import { ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";
import { dashboardFilterSchema } from "@/server/validators";

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const parsed = dashboardFilterSchema.parse({
    month: request.nextUrl.searchParams.get("month") ?? undefined,
    year: request.nextUrl.searchParams.get("year") ?? undefined
  });

  const now = new Date();
  const month = parsed.month ?? now.getMonth() + 1;
  const year = parsed.year ?? now.getFullYear();
  const windowStart = startOfMonth(new Date(year, month - 1, 1));
  const windowEnd = new Date(year, month, 0, 23, 59, 59);

  const [incomeAgg, expenseAgg, roomCount, occupiedCount, overdueCount] =
    await Promise.all([
      prisma.paymentTransaction.aggregate({
        _sum: { paidAmount: true },
        where: { paidAt: { gte: windowStart, lte: windowEnd } }
      }),
      prisma.expenseRecord.aggregate({
        _sum: { amount: true },
        where: { expenseDate: { gte: windowStart, lte: windowEnd } }
      }),
      prisma.room.count({ where: { deletedAt: null } }),
      prisma.room.count({ where: { status: "OCCUPIED", deletedAt: null } }),
      prisma.rentInvoice.count({ where: { status: "OVERDUE" } })
    ]);

  const occupancyRate = roomCount === 0 ? 0 : (occupiedCount / roomCount) * 100;

  return ok({
    totalIncome: Number(incomeAgg._sum.paidAmount ?? 0),
    totalExpense: Number(expenseAgg._sum.amount ?? 0),
    occupancyRate,
    overdueInvoices: overdueCount,
    month,
    year
  });
}
