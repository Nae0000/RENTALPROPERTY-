import { prisma } from "@/server/prisma";

export async function getTenantsWithSummary() {
  try {
    return await prisma.tenant.findMany({
      where: { deletedAt: null },
      include: {
        documents: true,
        leases: {
          where: { status: "ACTIVE" },
          include: { room: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch {
    return [];
  }
}

export async function getInvoicesWithPayments() {
  try {
    return await prisma.rentInvoice.findMany({
      include: { room: true, tenant: true, payments: true },
      orderBy: { dueDate: "asc" },
      take: 100
    });
  } catch {
    return [];
  }
}

type IncomeFilters = {
  status?: string;
  query?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function getInvoicesWithPaymentsFiltered(filters: IncomeFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 10));
  const skip = (page - 1) * pageSize;
  const status = filters.status && filters.status !== "ALL" ? filters.status : undefined;
  const query = filters.query?.trim();
  const sort = filters.sort ?? "dueDateAsc";

  try {
    const where = {
      ...(status ? { status: status as never } : {}),
      ...(query
        ? {
            OR: [
              { room: { roomNumber: { contains: query, mode: "insensitive" as const } } },
              { tenant: { fullName: { contains: query, mode: "insensitive" as const } } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.rentInvoice.findMany({
        where,
        include: { room: true, tenant: true, payments: true },
        orderBy:
          sort === "dueDateDesc"
            ? { dueDate: "desc" }
            : sort === "amountAsc"
              ? { amount: "asc" }
              : sort === "amountDesc"
                ? { amount: "desc" }
                : { dueDate: "asc" },
        skip,
        take: pageSize
      }),
      prisma.rentInvoice.count({ where })
    ]);

    return { items, total, page, pageSize };
  } catch {
    return { items: [], total: 0, page, pageSize };
  }
}

export async function getExpensesFeed() {
  try {
    return await prisma.expenseRecord.findMany({
      include: { room: true },
      orderBy: { expenseDate: "desc" },
      take: 100
    });
  } catch {
    return [];
  }
}

type ExpenseFilters = {
  type?: string;
  query?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function getExpensesFeedFiltered(filters: ExpenseFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 10));
  const skip = (page - 1) * pageSize;
  const type = filters.type && filters.type !== "ALL" ? filters.type : undefined;
  const query = filters.query?.trim();
  const sort = filters.sort ?? "dateDesc";

  try {
    const where = {
      ...(type ? { type: type as never } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { room: { roomNumber: { contains: query, mode: "insensitive" as const } } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.expenseRecord.findMany({
        where,
        include: { room: true },
        orderBy:
          sort === "dateAsc"
            ? { expenseDate: "asc" }
            : sort === "amountAsc"
              ? { amount: "asc" }
              : sort === "amountDesc"
                ? { amount: "desc" }
                : { expenseDate: "desc" },
        skip,
        take: pageSize
      }),
      prisma.expenseRecord.count({ where })
    ]);

    return { items, total, page, pageSize };
  } catch {
    return { items: [], total: 0, page, pageSize };
  }
}

export async function getCalendarEventsFeed() {
  try {
    return await prisma.calendarEvent.findMany({
      include: { room: true },
      orderBy: { eventDate: "asc" },
      take: 100
    });
  } catch {
    return [];
  }
}

type CalendarFilters = {
  type?: string;
  query?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export async function getCalendarEventsFeedFiltered(filters: CalendarFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 10));
  const skip = (page - 1) * pageSize;
  const type = filters.type && filters.type !== "ALL" ? filters.type : undefined;
  const query = filters.query?.trim();
  const sort = filters.sort ?? "dateAsc";

  try {
    const where = {
      ...(type ? { eventType: type as never } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { room: { roomNumber: { contains: query, mode: "insensitive" as const } } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.calendarEvent.findMany({
        where,
        include: { room: true },
        orderBy: sort === "dateDesc" ? { eventDate: "desc" } : { eventDate: "asc" },
        skip,
        take: pageSize
      }),
      prisma.calendarEvent.count({ where })
    ]);

    return { items, total, page, pageSize };
  } catch {
    return { items: [], total: 0, page, pageSize };
  }
}
