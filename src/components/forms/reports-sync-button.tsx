"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

export function ReportsSyncButton({ lang }: { lang: Lang }) {
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
        setMessage(payload?.error?.message ?? t(lang, "reports.syncFailed"));
      } else {
        setMessage(`${t(lang, "reports.syncQueued")}: ${payload?.data?.jobId ?? "-"}`);
      }
    } catch {
      setMessage(t(lang, "income.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">{t(lang, "reports.syncTitle")}</p>
      <Button onClick={onSync} disabled={loading}>
        {loading ? t(lang, "reports.syncing") : t(lang, "reports.syncNow")}
      </Button>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
