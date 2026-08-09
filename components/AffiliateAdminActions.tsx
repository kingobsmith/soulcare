"use client";

import { useState } from "react";

export function AffiliateAdminActions({ affiliateId }: { affiliateId: string }) {
  const [loading, setLoading] = useState(false);

  async function update(status: string) {
    setLoading(true);
    await fetch("/api/admin/affiliates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateId, status }),
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button disabled={loading} onClick={() => update("approved")} className="btn-primary text-xs disabled:opacity-60">
        Approve
      </button>
      <button disabled={loading} onClick={() => update("rejected")} className="btn-secondary text-xs disabled:opacity-60">
        Reject
      </button>
      <button disabled={loading} onClick={() => update("suspended")} className="btn-secondary text-xs disabled:opacity-60">
        Suspend
      </button>
    </div>
  );
}
