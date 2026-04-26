"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function TenantCreateForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone is required.");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? "Create tenant failed.");
      } else {
        setMessage("Tenant created.");
        setFullName("");
        setPhone("");
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <p className="font-medium">Create Tenant</p>
      <div className="grid gap-2 md:grid-cols-2">
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <Button onClick={onSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Tenant"}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
