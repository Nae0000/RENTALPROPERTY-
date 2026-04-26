import { ReportsSyncButton } from "@/components/forms/reports-sync-button";
import { Card } from "@/components/ui/card";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/translations";
import { getDashboardKpi, getMonthlyTrend } from "@/server/queries/dashboard";

export const dynamic = "force-dynamic";

function formatMoney(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export default async function ReportsPage() {
  const lang = getLang();
  const [kpi, trend] = await Promise.all([getDashboardKpi(), getMonthlyTrend(12)]);

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">{t(lang, "reports.title")}</h2>
        <p className="text-sm text-muted-foreground">{t(lang, "reports.subtitle")}</p>
      </Card>
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm text-muted-foreground">{t(lang, "reports.netCashflow")}</p>
            <p className="text-xl font-semibold">{formatMoney(kpi.totalIncome - kpi.totalExpense)}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-sm text-muted-foreground">{t(lang, "reports.occupancy")}</p>
            <p className="text-xl font-semibold">{kpi.occupancyRate}%</p>
          </div>
        </div>
      </Card>
      <ReportsSyncButton lang={lang} />
      <Card>
        <h3 className="mb-2 font-semibold">{t(lang, "reports.monthlyTrend")}</h3>
        <div className="space-y-2">
          {trend.map((item) => (
            <div key={`${item.month}-${item.income}`} className="rounded-lg border border-border p-3">
              <p className="font-medium">{item.month}</p>
              <p className="text-sm text-muted-foreground">
                Income {formatMoney(item.income)} | Expense {formatMoney(item.expense)}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
