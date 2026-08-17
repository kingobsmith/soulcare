"use client";

import { useEffect, useState } from "react";

export default function ResumeCheckout() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planKey = params.get("plan");
    if (!planKey) return;

    let cancelled = false;

    async function start() {
      setStatus("Opening checkout…");
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planKey }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.status === 401 || data?.code === "auth_required") {
          const next = encodeURIComponent(`/membership?plan=${planKey}`);
          window.location.href = `/login?next=${next}`;
          return;
        }

        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        setStatus(data?.error || "Checkout could not start.");
      } catch {
        if (!cancelled) setStatus("Checkout could not start.");
      }
    }

    start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!status) return null;

  return <p className="mb-6 text-sm text-teal">{status}</p>;
}
