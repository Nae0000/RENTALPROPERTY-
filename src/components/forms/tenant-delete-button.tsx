"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TenantDeleteButton({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    setLoading(true);
    try {
      await fetch(`/api/tenants/${tenantId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="rounded border border-rose-400 px-2 py-1 text-xs text-rose-500 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
