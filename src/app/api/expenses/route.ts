import { NextRequest } from "next/server";
import { ExpenseType } from "@prisma/client";
import { z } from "zod";
import { requireSession } from "@/server/auth";
import { created, fail, ok } from "@/server/api-response";
import { prisma } from "@/server/prisma";

const createExpenseSchema = z.object({
  roomId: z.string().optional(),
  type: z.nativeEnum(ExpenseType),
  title: z.string().min(1),
  amount: z.number().positive(),
  expenseDate: z.string().datetime(),
  note: z.string().optional()
});

export async function GET(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const type = request.nextUrl.searchParams.get("type") ?? undefined;
  const from = request.nextUrl.searchParams.get("from") ?? undefined;
  const to = request.nextUrl.searchParams.get("to") ?? undefined;

  const expenses = await prisma.expenseRecord.findMany({
    where: {
      ...(type ? { type: type as ExpenseType } : {}),
      ...(from || to
        ? {
            expenseDate: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {})
            }
          }
        : {})
    },
    orderBy: { expenseDate: "desc" }
  });

  return ok(expenses);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = createExpenseSchema.safeParse(payload);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Invalid expense payload", 400, parsed.error.flatten());
  }

  const expense = await prisma.expenseRecord.create({
    data: {
      ...parsed.data,
      expenseDate: new Date(parsed.data.expenseDate)
    }
  });

  return created(expense);
}
