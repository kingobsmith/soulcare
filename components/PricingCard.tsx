"use client";

import { useState } from "react";

export default function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  planKey,
  featured = false,
  ctaLabel = "Get started"
}: {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  planKey: string | null;
  featured?: boolean;
  ctaLabel?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (!planKey) {
      window.location.href = "/care-match";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey })
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || "Something went wrong starting checkout.");
      }
    } catch (e) {
      alert("Something went wrong starting checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`card flex flex-col ${
        featured ? "border-2 border-brass shadow-soft" : ""
      }`}
    >
      {featured && (
        <span className="mb-3 inline-block w-fit rounded-full bg-brass px-3 py-1 text-xs font-semibold text-ink">
          Most chosen
        </span>
      )}
      <h3 className="font-display text-2xl font-semibold">{name}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold">{price}</span>
        {cadence && <span className="text-sm text-ink/50">/{cadence}</span>}
      </div>
      <p className="mt-3 text-sm text-ink/70">{description}</p>
      <ul className="mt-6 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-teal">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary mt-8 w-full disabled:opacity-60"
      >
        {loading ? "Redirecting…" : ctaLabel}
      </button>
    </div>
  );
}
