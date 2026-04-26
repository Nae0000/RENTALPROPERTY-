import { Card } from "@/components/ui/card";

type KpiCardsProps = {
  totalIncome: number;
  totalExpense: number;
  occupancyRate: number;
  overdueInvoices: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export function KpiCards({ totalIncome, totalExpense, occupancyRate, overdueInvoices }: KpiCardsProps) {
  const items = [
    { title: "Total Income", value: formatCurrency(totalIncome) },
    { title: "Total Expense", value: formatCurrency(totalExpense) },
    { title: "Occupancy Rate", value: `${occupancyRate}%` },
    { title: "Overdue Rooms", value: String(overdueInvoices) }
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <p className="text-sm text-muted-foreground">{item.title}</p>
          <p className="mt-2 text-2xl font-semibold">{item.value}</p>
        </Card>
      ))}
    </section>
  );
}
