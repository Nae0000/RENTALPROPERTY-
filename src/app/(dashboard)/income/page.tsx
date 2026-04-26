import { IncomePaymentForm } from "@/components/forms/income-payment-form";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { getInvoicesWithPaymentsFiltered } from "@/server/queries/operations";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

type IncomePageProps = {
  searchParams?: {
    status?: string;
    query?: string;
    sort?: string;
    page?: string;
  };
};

export default async function IncomePage({ searchParams }: IncomePageProps) {
  const status = searchParams?.status ?? "ALL";
  const query = searchParams?.query ?? "";
  const sort = searchParams?.sort ?? "dueDateAsc";
  const page = Number(searchParams?.page ?? "1");
  const data = await getInvoicesWithPaymentsFiltered({
    status,
    query,
    sort,
    page: Number.isFinite(page) ? page : 1
  });
  const invoices = data.items;
  const invoiceOptions = invoices.map((invoice) => {
    const paid = invoice.payments.reduce((sum, p) => sum + Number(p.paidAmount), 0);
    return {
      id: invoice.id,
      roomNumber: invoice.room.roomNumber,
      tenantName: invoice.tenant.fullName,
      dueAmount: Math.max(0, Number(invoice.amount) - paid)
    };
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Income Tracking</h2>
        <p className="text-sm text-muted-foreground">Track monthly rent invoices, payment status, and deposits.</p>
        <form className="mt-3 grid gap-2 md:grid-cols-5">
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="ALL">All status</option>
            <option value="PENDING">PENDING</option>
            <option value="PARTIAL">PARTIAL</option>
            <option value="PAID">PAID</option>
            <option value="OVERDUE">OVERDUE</option>
          </select>
          <input
            name="query"
            defaultValue={query}
            placeholder="Search room or tenant"
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm md:col-span-2"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="dueDateAsc">Due date: Oldest</option>
            <option value="dueDateDesc">Due date: Newest</option>
            <option value="amountAsc">Amount: Low to high</option>
            <option value="amountDesc">Amount: High to low</option>
          </select>
          <button className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">Apply</button>
        </form>
      </Card>
      <IncomePaymentForm invoices={invoiceOptions} />
      <Card>
        <div className="space-y-2">
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invoices yet.</p>
          ) : null}
          {invoices.map((invoice) => {
            const paid = invoice.payments.reduce((sum, p) => sum + Number(p.paidAmount), 0);
            return (
              <div key={invoice.id} className="rounded-lg border border-border p-3">
                <p className="font-medium">
                  {invoice.room.roomNumber} - {invoice.tenant.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due {new Date(invoice.dueDate).toLocaleDateString()} | Status: {invoice.status}
                </p>
                <p className="text-sm">
                  {formatMoney(Number(invoice.amount))} | Paid: {formatMoney(paid)}
                </p>
              </div>
            );
          })}
        </div>
        <Pagination
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          buildHref={(targetPage) =>
            `?status=${encodeURIComponent(status)}&query=${encodeURIComponent(query)}&sort=${encodeURIComponent(sort)}&page=${targetPage}`
          }
        />
      </Card>
    </div>
  );
}
