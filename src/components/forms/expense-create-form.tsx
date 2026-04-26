"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

export function ExpenseCreateForm({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!title.trim()) {
      setError(t(lang, "expenses.titleRequired"));
      return;
    }
    if (amount <= 0) {
      setError(t(lang, "expenses.amountRequired"));
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          amount,
          type,
          expenseDate: new Date().toISOString()
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? t(lang, "expenses.createFailed"));
      } else {
        setMessage(t(lang, "expenses.created"));
        setTitle("");
        setAmount(0);
        router.refresh();
      }
    } catch {
      setError(t(lang, "income.networkError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">{t(lang, "expenses.addTitle")}</p>
      <input
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={t(lang, "expenses.addTitle")}
      />
      <input
        type="number"
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        placeholder={t(lang, "rooms.monthlyRent")}
      />
      <select
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="FIXED">FIXED</option>
        <option value="WATER">WATER</option>
        <option value="ELECTRICITY">ELECTRICITY</option>
        <option value="REPAIR">REPAIR</option>
        <option value="OTHER">OTHER</option>
      </select>
      <Button onClick={onSubmit} disabled={loading || !title || amount <= 0}>
        {loading ? t(lang, "income.saving") : t(lang, "expenses.create")}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
