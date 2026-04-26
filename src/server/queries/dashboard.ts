import { prisma } from "@/server/prisma";

export type DashboardKpi = {
  totalIncome: number;
  totalExpense: number;
  occupancyRate: number;
  overdueInvoices: number;
};

export type MonthlyTrendPoint = {
  month: string;
  income: number;
  expense: number;
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getDashboardKpi(): Promise<DashboardKpi> {
  try {
    const [income, expense, rooms, occupied, overdue] = await Promise.all([
      prisma.paymentTransaction.aggregate({ _sum: { paidAmount: true } }),
      prisma.expenseRecord.aggregate({ _sum: { amount: true } }),
      prisma.room.count({ where: { deletedAt: null } }),
      prisma.room.count({ where: { status: "OCCUPIED", deletedAt: null } }),
      prisma.rentInvoice.count({ where: { status: "OVERDUE" } })
    ]);

    return {
      totalIncome: Number(income._sum.paidAmount ?? 0),
      totalExpense: Number(expense._sum.amount ?? 0),
      occupancyRate: rooms === 0 ? 0 : Number(((occupied / rooms) * 100).toFixed(1)),
      overdueInvoices: overdue
    };
  } catch {
    return { totalIncome: 0, totalExpense: 0, occupancyRate: 0, overdueInvoices: 0 };
  }
}

export async function getMonthlyTrend(limit = 6): Promise<MonthlyTrendPoint[]> {
  let snapshots: Awaited<ReturnType<typeof prisma.reportSnapshot.findMany>> = [];
  try {
    snapshots = await prisma.reportSnapshot.findMany({
      orderBy: [{ year: "asc" }, { month: "asc" }],
      take: limit
    });
  } catch {
    snapshots = [];
  }

  if (snapshots.length > 0) {
    return snapshots.map((item) => ({
      month: monthNames[item.month - 1],
      income: Number(item.totalIncome),
      expense: Number(item.totalExpense)
    }));
  }

  return monthNames.slice(0, 4).map((month) => ({ month, income: 0, expense: 0 }));
}
