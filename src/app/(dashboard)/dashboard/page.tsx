import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { getLang } from "@/i18n/server";
import { getDashboardKpi, getMonthlyTrend } from "@/server/queries/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const lang = getLang();
  const [kpi, trend] = await Promise.all([getDashboardKpi(), getMonthlyTrend()]);

  return (
    <div className="space-y-4">
      <KpiCards {...kpi} lang={lang} />
      <IncomeExpenseChart data={trend} lang={lang} />
    </div>
  );
}
