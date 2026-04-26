"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReportsSyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSync() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/integrations/google-sheets/sync", {
        method: "POST",
        headers: {
          "x-idempotency-key": `${Date.now()}-manual-sync`
        }
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload?.error?.message ?? "Sync failed");
      } else {
        setMessage(`Sync queued: ${payload?.data?.jobId ?? "-"}`);
      }
    } catch {
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">Google Sheets Sync</p>
      <Button onClick={onSync} disabled={loading}>
        {loading ? "Syncing..." : "Sync Now"}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
