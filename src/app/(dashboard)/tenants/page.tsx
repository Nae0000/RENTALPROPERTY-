import { TenantCreateForm } from "@/components/forms/tenant-create-form";
import { TenantDeleteButton } from "@/components/forms/tenant-delete-button";
import { TenantDocumentForm } from "@/components/forms/tenant-document-form";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { getLang } from "@/i18n/server";
import { t } from "@/i18n/translations";
import { getTenantsWithSummaryFiltered } from "@/server/queries/operations";

export const dynamic = "force-dynamic";

type TenantsPageProps = {
  searchParams?: {
    query?: string;
    page?: string;
  };
};

export default async function TenantsPage({ searchParams }: TenantsPageProps) {
  const lang = getLang();
  const query = searchParams?.query ?? "";
  const page = Number(searchParams?.page ?? "1");
  const data = await getTenantsWithSummaryFiltered({
    query,
    page: Number.isFinite(page) ? page : 1
  });
  const tenants = data.items;
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t(lang, "tenants.title")}</h2>
        <form className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            name="query"
            defaultValue={query}
            placeholder="Search tenant name or phone"
            className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">{t(lang, "common.apply")}</button>
        </form>
      </Card>

      <TenantCreateForm />

      <Card>
        <div className="space-y-3">
          {tenants.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t(lang, "tenants.empty")}</p>
          ) : null}
          {tenants.map((tenant) => (
            <div key={tenant.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{tenant.fullName}</p>
                  <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                  <p className="mt-1 text-sm">
                    {t(lang, "tenants.activeRoom")}: {tenant.leases[0]?.room.roomNumber ?? "-"} | {t(lang, "tenants.documents")}:{" "}
                    {tenant.documents.length}
                  </p>
                </div>
                <TenantDeleteButton tenantId={tenant.id} />
              </div>
              <TenantDocumentForm tenantId={tenant.id} />
            </div>
          ))}
        </div>
        <Pagination
          page={data.page}
          total={data.total}
          pageSize={data.pageSize}
          lang={lang}
          buildHref={(targetPage) => `?query=${encodeURIComponent(query)}&page=${targetPage}`}
        />
      </Card>
    </div>
  );
}
