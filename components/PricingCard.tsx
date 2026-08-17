"use client";

import { useState } from "react";

const accents = {
  warm: "from-amber-100/80 via-orange-50/60 to-parchment",
  warmPlus: "from-teal/15 via-parchment to-amber-50/50",
  pro: "from-slate-200/70 via-parchment to-teal/10",
  proPlus: "from-teal/20 via-slate-100/60 to-parchment",
};

export default function PricingCard({
  name,
  price,
  cadence,
  description,
  disclaimer,
  features,
  planKey,
  featured = false,
  accent = "warm",
  ctaLabel = "Checkout now",
}: {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  disclaimer?: string;
  features: string[];
  planKey: string;
  featured?: boolean;
  accent?: keyof typeof accents;
  ctaLabel?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();

      if (res.status === 401 || data?.code === "auth_required") {
        const next = encodeURIComponent(`/membership?plan=${planKey}`);
        window.location.href = `/login?next=${next}`;
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.error || "Checkout could not start. Please try again.");
      }
    } catch {
      alert("Checkout could not start. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`card flex flex-col overflow-hidden p-0 ${
        featured ? "border-2 border-brass shadow-soft" : ""
      }`}
    >
      <div className={`bg-gradient-to-br ${accents[accent]} px-6 py-8`}>
        {featured && (
          <span className="mb-2 inline-block rounded-full bg-brass px-3 py-1 text-xs font-semibold text-ink">
            Most chosen
          </span>
        )}
        <h3 className="font-display text-2xl font-semibold">{name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-semibold">{price}</span>
          {cadence && <span className="text-sm text-ink/50">/{cadence}</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        <p className="text-sm text-ink/75">{description}</p>
        {disclaimer && (
          <p className="mt-3 rounded-lg border border-ink/10 bg-parchment/60 px-3 py-2 text-xs text-ink/65">
            {disclaimer}
          </p>
        )}
        <ul className="mt-5 flex-1 space-y-2 text-sm">
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
          className="btn-primary mt-6 w-full disabled:opacity-60"
        >
          {loading ? "Opening checkout…" : ctaLabel}
        </button>
        <p className="mt-2 text-center text-xs text-ink/50">Log in or sign up required</p>
      </div>
    </div>
  );
}
