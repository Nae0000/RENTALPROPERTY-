"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  "Create tenant profile",
  "Upload contract and ID card",
  "Assign room and lease",
  "Generate first invoice"
];

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    propertyId: "default-property",
    roomId: "",
    roomNumber: "",
    tenantName: "",
    phone: "",
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)).toISOString(),
    monthlyRent: 0,
    securityAmount: 0
  });
  const isDone = step === steps.length - 1;

  async function submitOnboarding() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload?.error?.message ?? "Onboarding failed");
      } else {
        setMessage("Onboarding completed successfully");
      }
    } catch {
      setMessage("Network error while creating onboarding records");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-4">
      <h2 className="text-lg font-semibold">One-Click Tenant Onboarding</h2>
      <ol className="space-y-2">
        {steps.map((item, index) => (
          <li key={item} className={index === step ? "font-medium text-accent" : "text-muted-foreground"}>
            {index + 1}. {item}
          </li>
        ))}
      </ol>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={form.roomId}
          onChange={(event) => setForm((prev) => ({ ...prev, roomId: event.target.value }))}
          placeholder="Room ID"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          value={form.roomNumber}
          onChange={(event) => setForm((prev) => ({ ...prev, roomNumber: event.target.value }))}
          placeholder="Room number"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          value={form.tenantName}
          onChange={(event) => setForm((prev) => ({ ...prev, tenantName: event.target.value }))}
          placeholder="Tenant full name"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          placeholder="Phone"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="number"
          value={form.monthlyRent}
          onChange={(event) => setForm((prev) => ({ ...prev, monthlyRent: Number(event.target.value) }))}
          placeholder="Monthly rent"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="number"
          value={form.securityAmount}
          onChange={(event) => setForm((prev) => ({ ...prev, securityAmount: Number(event.target.value) }))}
          placeholder="Security amount"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
          {isDone ? "Finish" : "Next"}
        </Button>
        <Button onClick={submitOnboarding} disabled={loading}>
          {loading ? "Submitting..." : "Create Tenant + Lease + Invoice"}
        </Button>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </Card>
  );
}
