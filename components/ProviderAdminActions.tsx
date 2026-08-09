"use client";

import { useState } from "react";

export function ProviderAdminActions({ providerId }: { providerId: string }) {
  const [loading, setLoading] = useState(false);

  async function update(status: string) {
    setLoading(true);
    await fetch("/api/admin/providers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, status }),
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button disabled={loading} onClick={() => update("verified")} className="btn-primary text-xs disabled:opacity-60">
        Approve
      </button>
      <button disabled={loading} onClick={() => update("needs_information")} className="btn-secondary text-xs disabled:opacity-60">
        Request info
      </button>
      <button disabled={loading} onClick={() => update("rejected")} className="btn-secondary text-xs disabled:opacity-60">
        Reject
      </button>
    </div>
  );
}
