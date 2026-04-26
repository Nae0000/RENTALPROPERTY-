"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type RoomCreateFormProps = {
  propertyId: string | null;
};

export function RoomCreateForm({ propertyId }: RoomCreateFormProps) {
  const router = useRouter();
  const [roomNumber, setRoomNumber] = useState("");
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [status, setStatus] = useState("VACANT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!propertyId) {
      setError("No property found. Please create a property first.");
      return;
    }
    if (!roomNumber.trim()) {
      setError("Room number is required.");
      return;
    }
    if (monthlyRent <= 0) {
      setError("Monthly rent must be greater than zero.");
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
        setError(payload?.error?.message ?? "Create room failed.");
      } else {
        setMessage("Room created successfully.");
        setRoomNumber("");
        setMonthlyRent(0);
        setStatus("VACANT");
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
      <p className="font-medium">Create Room</p>
      <div className="grid gap-2 md:grid-cols-3">
        <input
          value={roomNumber}
          onChange={(event) => setRoomNumber(event.target.value)}
          placeholder="Room number"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <input
          type="number"
          value={monthlyRent}
          onChange={(event) => setMonthlyRent(Number(event.target.value))}
          placeholder="Monthly rent"
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm"
        >
          <option value="VACANT">VACANT</option>
          <option value="OCCUPIED">OCCUPIED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>
      </div>
      <Button onClick={onSubmit} disabled={loading || !propertyId}>
        {loading ? "Creating..." : "Create Room"}
      </Button>
      {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
    </div>
  );
}
