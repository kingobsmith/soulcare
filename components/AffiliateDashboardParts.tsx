"use client";

import { useState } from "react";
import Link from "next/link";

export function AffiliateReferralCard({
  referralUrl,
  referralCode,
}: {
  referralUrl: string;
  referralCode: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card">
      <h2 className="font-display text-lg font-semibold">Your referral link</h2>
      <p className="mt-2 break-all text-sm text-ink/70">{referralUrl}</p>
      <button onClick={copy} className="btn-primary mt-4">
        {copied ? "Copied!" : "Copy link"}
      </button>
      <p className="mt-2 text-xs text-ink/50">Code: {referralCode}</p>
      <p className="mt-4 rounded-lg bg-parchment p-3 text-xs text-ink/65">
        Required disclosure: &ldquo;I may receive a commission if you join Soul Care through my
        link.&rdquo;
      </p>
    </div>
  );
}

export function AffiliateSupportCard() {
  return (
    <div className="card">
      <h2 className="font-display text-lg font-semibold">Need help?</h2>
      <p className="mt-2 text-sm text-ink/70">
        Contact Soul Care support if you believe your account was suspended in error.
      </p>
      <Link href="/contact" className="btn-secondary mt-4 inline-flex">
        Contact support
      </Link>
    </div>
  );
}
