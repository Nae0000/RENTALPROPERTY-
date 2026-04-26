import { Card } from "@/components/ui/card";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

type KpiCardsProps = {
  totalIncome: number;
  totalExpense: number;
  occupancyRate: number;
  overdueInvoices: number;
  lang: Lang;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export function KpiCards({ totalIncome, totalExpense, occupancyRate, overdueInvoices, lang }: KpiCardsProps) {
  const items = [
    { title: t(lang, "dashboard.totalIncome"), value: formatCurrency(totalIncome) },
    { title: t(lang, "dashboard.totalExpense"), value: formatCurrency(totalExpense) },
    { title: t(lang, "dashboard.occupancyRate"), value: `${occupancyRate}%` },
    { title: t(lang, "dashboard.overdueRooms"), value: String(overdueInvoices) }
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
