"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

type RoomCreateFormProps = {
  propertyId: string | null;
  lang: Lang;
};

export function RoomCreateForm({ propertyId, lang }: RoomCreateFormProps) {
  const router = useRouter();
  const [roomNumber, setRoomNumber] = useState("");
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [status, setStatus] = useState("VACANT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!propertyId) {
      setError(t(lang, "rooms.noProperty"));
      return;
    }
    if (!roomNumber.trim()) {
      setError(t(lang, "rooms.requiredRoomNo"));
      return;
    }
    if (monthlyRent <= 0) {
      setError(t(lang, "rooms.invalidRent"));
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          roomNumber,
          monthlyRent,
          status
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? t(lang, "rooms.createError"));
      } else {
        setMessage(t(lang, "rooms.created"));
        setRoomNumber("");
        setMonthlyRent(0);
        setStatus("VACANT");
        router.refresh();
      }
    } catch {
      setError(t(lang, "rooms.createError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">{t(lang, "rooms.createTitle")}</p>
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={roomNumber}
          onChange={(event) => setRoomNumber(event.target.value)}
          placeholder={t(lang, "rooms.roomNumber")}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="number"
          value={monthlyRent}
          onChange={(event) => setMonthlyRent(Number(event.target.value))}
          placeholder={t(lang, "rooms.monthlyRent")}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        >
          <option value="VACANT">{t(lang, "rooms.status.vacant")}</option>
          <option value="OCCUPIED">{t(lang, "rooms.status.occupied")}</option>
          <option value="MAINTENANCE">{t(lang, "rooms.status.maintenance")}</option>
        </select>
      </div>
      <Button onClick={onSubmit} disabled={loading || !propertyId}>
        {loading ? t(lang, "rooms.creating") : t(lang, "rooms.create")}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
