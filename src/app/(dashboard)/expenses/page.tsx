import { ExpenseCreateForm } from "@/components/forms/expense-create-form";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { getExpensesFeedFiltered } from "@/server/queries/operations";

function formatMoney(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

type ExpensesPageProps = {
  searchParams?: {
    type?: string;
    query?: string;
    sort?: string;
    page?: string;
  };
};

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const type = searchParams?.type ?? "ALL";
  const query = searchParams?.query ?? "";
  const sort = searchParams?.sort ?? "dateDesc";
  const page = Number(searchParams?.page ?? "1");
  const data = await getExpensesFeedFiltered({
    type,
    query,
    sort,
    page: Number.isFinite(page) ? page : 1
  });
  const expenses = data.items;
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Expense Tracking</h2>
        <p className="text-sm text-muted-foreground">
          Manage fixed and variable expenses including water, electricity, and repairs.
        </p>
        <form className="mt-3 grid gap-2 md:grid-cols-5">
          <select
            name="type"
            defaultValue={type}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="ALL">All type</option>
            <option value="FIXED">FIXED</option>
            <option value="WATER">WATER</option>
            <option value="ELECTRICITY">ELECTRICITY</option>
            <option value="REPAIR">REPAIR</option>
            <option value="OTHER">OTHER</option>
          </select>
          <input
            name="query"
            defaultValue={query}
            placeholder="Search title or room"
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm md:col-span-2"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="dateDesc">Date: Newest</option>
            <option value="dateAsc">Date: Oldest</option>
            <option value="amountAsc">Amount: Low to high</option>
            <option value="amountDesc">Amount: High to low</option>
          </select>
          <button className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">Apply</button>
        </form>
      </Card>
      <ExpenseCreateForm />
      <Card>
        <div className="space-y-2">
          {expenses.length === 0 ? <p className="text-sm text-muted-foreground">No expenses yet.</p> : null}
          {expenses.map((expense) => (
            <div key={expense.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{expense.title}</p>
              <p className="text-sm text-muted-foreground">
                {expense.type} | {expense.room?.roomNumber ?? "Shared"}
              </p>
              <p className="text-sm">
                {formatMoney(Number(expense.amount))} on {new Date(expense.expenseDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <Pagination
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          buildHref={(targetPage) =>
            `?type=${encodeURIComponent(type)}&query=${encodeURIComponent(query)}&sort=${encodeURIComponent(sort)}&page=${targetPage}`
          }
        />
      </Card>
    </div>
  );
}
