"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ExpenseCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("OTHER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
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
        setError(payload?.error?.message ?? "Create expense failed");
      } else {
        setMessage("Expense created");
        setTitle("");
        setAmount(0);
        router.refresh();
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">Add Expense</p>
      <input
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title"
      />
      <input
        type="number"
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={amount}
        onChange={(event) => setAmount(Number(event.target.value))}
        placeholder="Amount"
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
        {loading ? "Saving..." : "Create Expense"}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
