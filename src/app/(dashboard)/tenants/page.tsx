import { Card } from "@/components/ui/card";
import { getTenantsWithSummary } from "@/server/queries/operations";

export default async function TenantsPage() {
  const tenants = await getTenantsWithSummary();
  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">Tenant Detail</h2>
      <div className="space-y-3">
        {tenants.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tenants yet. Use onboarding to add the first tenant.</p>
        ) : null}
        {tenants.map((tenant) => (
          <div key={tenant.id} className="rounded-lg border border-border p-3">
            <p className="font-medium">{tenant.fullName}</p>
            <p className="text-sm text-muted-foreground">{tenant.phone}</p>
            <p className="mt-1 text-sm">
              Active room: {tenant.leases[0]?.room.roomNumber ?? "-"} | Documents: {tenant.documents.length}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
