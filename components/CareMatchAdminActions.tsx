"use client";

import { useState } from "react";

export function CareMatchAdminActions({
  requestId,
  providers,
}: {
  requestId: string;
  providers: { id: string; public_name: string }[];
}) {
  const [providerId, setProviderId] = useState("");
  const [loading, setLoading] = useState(false);

  async function update(status: string) {
    setLoading(true);
    await fetch("/api/admin/care-match", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status, providerId: providerId || undefined }),
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="mt-3 space-y-2">
      <select
        className="input text-xs"
        value={providerId}
        onChange={(e) => setProviderId(e.target.value)}
      >
        <option value="">Assign provider (optional)</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.public_name}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2">
        <button disabled={loading} onClick={() => update("reviewing")} className="btn-secondary text-xs disabled:opacity-60">
          Mark reviewing
        </button>
        <button disabled={loading} onClick={() => update("matched")} className="btn-primary text-xs disabled:opacity-60">
          Match & refer
        </button>
        <button disabled={loading} onClick={() => update("closed")} className="btn-secondary text-xs disabled:opacity-60">
          Close
        </button>
      </div>
    </div>
  );
}
