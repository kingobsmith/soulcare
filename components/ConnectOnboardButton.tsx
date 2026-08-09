"use client";

import { useState } from "react";

export default function ConnectOnboardButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || "Could not start payout onboarding.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Redirecting…" : "Set up payouts with Stripe"}
    </button>
  );
}
