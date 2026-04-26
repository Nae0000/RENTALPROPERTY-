"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CalendarEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("RENT_DUE");
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!eventDate) {
      setError("Event date is required.");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          eventType,
          eventDate: new Date(eventDate).toISOString(),
          status
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? "Create event failed");
      } else {
        setMessage("Event created");
        setTitle("");
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
      <p className="font-medium">Add Calendar Event</p>
      <input
        className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Event title"
      />
      <div className="grid gap-2 md:grid-cols-3">
        <select
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
        >
          <option value="RENT_DUE">RENT_DUE</option>
          <option value="LEASE_EXPIRY">LEASE_EXPIRY</option>
          <option value="PAYMENT_RECEIVED">PAYMENT_RECEIVED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
        <input
          type="date"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          value={eventDate}
          onChange={(event) => setEventDate(event.target.value)}
        />
        <input
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          placeholder="Status"
        />
      </div>
      <Button onClick={onSubmit} disabled={loading || !title}>
        {loading ? "Saving..." : "Create Event"}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
