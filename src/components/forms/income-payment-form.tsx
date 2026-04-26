"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/i18n/translations";
import { t } from "@/i18n/translations";

type InvoiceOption = {
  id: string;
  roomNumber: string;
  tenantName: string;
  dueAmount: number;
};

export function IncomePaymentForm({ invoices, lang }: { invoices: InvoiceOption[]; lang: Lang }) {
  const router = useRouter();
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id ?? "");
  const [paidAmount, setPaidAmount] = useState(invoices[0]?.dueAmount ?? 0);
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!invoiceId) {
      setError(t(lang, "income.selectInvoice"));
      return;
    }
    if (paidAmount <= 0) {
      setError(t(lang, "income.amountRequired"));
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentInvoiceId: invoiceId, paidAmount, method })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? t(lang, "income.paymentFailed"));
      } else {
        setMessage(t(lang, "income.paymentRecorded"));
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
      <p className="font-medium">{t(lang, "income.markPayment")}</p>
      <select
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={invoiceId}
        onChange={(event) => setInvoiceId(event.target.value)}
      >
        {invoices.map((invoice) => (
          <option key={invoice.id} value={invoice.id}>
            {invoice.roomNumber} - {invoice.tenantName}
          </option>
        ))}
      </select>
      <input
        type="number"
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={paidAmount}
        onChange={(event) => setPaidAmount(Number(event.target.value))}
        placeholder={t(lang, "income.paidAmount")}
      />
      <input
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={method}
        onChange={(event) => setMethod(event.target.value)}
        placeholder={t(lang, "income.paymentMethod")}
      />
      <Button onClick={onSubmit} disabled={loading || !invoiceId}>
        {loading ? t(lang, "income.saving") : t(lang, "income.submitPayment")}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
