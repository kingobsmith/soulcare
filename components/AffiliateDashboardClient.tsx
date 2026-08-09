"use client";

import { useEffect, useState } from "react";

export default function AffiliateDashboardClient() {
  const [data, setData] = useState<{ link: string; referrals: number; code: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/affiliate")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-ink/60">Loading…</p>;

  async function copy() {
    await navigator.clipboard.writeText(data!.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="card">
        <h2 className="font-display text-lg font-semibold">Your referral link</h2>
        <p className="mt-2 break-all text-sm text-ink/70">{data.link}</p>
        <button onClick={copy} className="btn-primary mt-4">
          {copied ? "Copied!" : "Copy link"}
        </button>
        <p className="mt-2 text-xs text-ink/50">Code: {data.code}</p>
      </div>
      <div className="card">
        <h2 className="font-display text-lg font-semibold">Referrals</h2>
        <p className="mt-2 font-display text-4xl font-semibold text-teal">{data.referrals}</p>
        <p className="text-sm text-ink/60">Sign-ups attributed to your link</p>
      </div>
    </div>
  );
}
