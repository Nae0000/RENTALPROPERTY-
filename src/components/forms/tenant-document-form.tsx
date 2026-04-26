"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TenantDocumentFormProps = {
  tenantId: string;
};

export function TenantDocumentForm({ tenantId }: TenantDocumentFormProps) {
  const router = useRouter();
  const [type, setType] = useState("OTHER");
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!fileName.trim() || !fileUrl.trim()) {
      setError("Document name and URL are required.");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          fileName,
          fileUrl,
          mimeType: "application/octet-stream",
          fileSize: 0
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error?.message ?? "Add document failed.");
      } else {
        setMessage("Document added.");
        setFileName("");
        setFileUrl("");
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-border p-2">
      <p className="text-xs font-medium">Add document</p>
      <div className="grid gap-2 md:grid-cols-3">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-md border border-border bg-transparent px-2 py-1 text-xs"
        >
          <option value="LEASE_AGREEMENT">LEASE_AGREEMENT</option>
          <option value="ID_CARD">ID_CARD</option>
          <option value="OTHER">OTHER</option>
        </select>
        <input
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="File name"
          className="rounded-md border border-border bg-transparent px-2 py-1 text-xs"
        />
        <input
          value={fileUrl}
          onChange={(event) => setFileUrl(event.target.value)}
          placeholder="https://..."
          className="rounded-md border border-border bg-transparent px-2 py-1 text-xs"
        />
      </div>
      <Button onClick={onSubmit} disabled={loading} className="h-8 px-3 py-1 text-xs">
        {loading ? "Saving..." : "Add Document"}
      </Button>
      {message ? <p className="text-xs text-emerald-500">{message}</p> : null}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
