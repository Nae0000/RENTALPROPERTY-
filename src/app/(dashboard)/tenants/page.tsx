import { Card } from "@/components/ui/card";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/translations";
import { getTenantsWithSummary } from "@/server/queries/operations";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const lang = getLang();
  const tenants = await getTenantsWithSummary();
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{t(lang, "tenants.title")}</h2>
      <div className="space-y-3">
        {tenants.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t(lang, "tenants.empty")}</p>
        ) : null}
        {tenants.map((tenant) => (
          <div key={tenant.id} className="rounded-lg border border-border p-3">
            <p className="font-medium">{tenant.fullName}</p>
            <p className="text-sm text-muted-foreground">{tenant.phone}</p>
            <p className="mt-1 text-sm">
              {t(lang, "tenants.activeRoom")}: {tenant.leases[0]?.room.roomNumber ?? "-"} | {t(lang, "tenants.documents")}:{" "}
              {tenant.documents.length}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
