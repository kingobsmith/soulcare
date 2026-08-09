"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Section from "@/components/Section";

const audienceTypes = [
  "church",
  "community organization",
  "therapist/provider",
  "creator",
  "educator",
  "other",
];

const audienceSizes = ["Under 500", "500–2,000", "2,000–10,000", "10,000–50,000", "50,000+"];

export default function AffiliateJoinForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [step, setStep] = useState<"account" | "application">(isAuthenticated ? "application" : "account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [legalName, setLegalName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [websiteOrSocialUrl, setWebsiteOrSocialUrl] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [country, setCountry] = useState("");
  const [audienceType, setAudienceType] = useState(audienceTypes[0]);
  const [audienceSizeRange, setAudienceSizeRange] = useState(audienceSizes[0]);
  const [promotionPlan, setPromotionPlan] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [promotionRulesAccepted, setPromotionRulesAccepted] = useState(false);

  const supabase = createClient();

  async function handleAccount(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/affiliates/join`,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    await fetch("/api/affiliates/attribute", { method: "POST" });
    setAuthed(true);
    setLegalName(fullName);
    setStep("application");
  }

  async function handleApplication(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/affiliates/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        legalName,
        organizationName,
        websiteOrSocialUrl,
        city,
        stateRegion,
        country,
        audienceType,
        audienceSizeRange,
        promotionPlan,
        termsAccepted,
        promotionRulesAccepted,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not submit application.");
      return;
    }
    window.location.href = "/affiliate/dashboard";
  }

  return (
    <Section tone="parchment" className="flex justify-center">
      <div className="card w-full max-w-2xl">
        <p className="eyebrow">Affiliate application</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Become an Affiliate Partner</h1>
        <p className="mt-2 text-sm text-ink/65">
          Complete your application below. Referral links and commissions activate only after approval.
        </p>

        {!authed && step === "account" ? (
          <form onSubmit={handleAccount} className="mt-8 grid gap-4">
            <div>
              <label className="label">Full name</label>
              <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input className="input" type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? "Creating account…" : "Create account & continue"}
            </button>
            <p className="text-sm text-ink/60">
              Already have an account?{" "}
              <Link href="/login?next=/affiliates/join" className="font-semibold text-teal underline underline-offset-2">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleApplication} className="mt-8 grid gap-4">
            <div>
              <label className="label">Legal full name *</label>
              <input className="input" required value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            </div>
            <div>
              <label className="label">Business, church, organization, or brand name</label>
              <input className="input" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
            </div>
            <div>
              <label className="label">Website or social profile URL</label>
              <input className="input" type="url" value={websiteOrSocialUrl} onChange={(e) => setWebsiteOrSocialUrl(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">City *</label>
                <input className="input" required value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div>
                <label className="label">State / province *</label>
                <input className="input" required value={stateRegion} onChange={(e) => setStateRegion(e.target.value)} />
              </div>
              <div>
                <label className="label">Country *</label>
                <input className="input" required value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Audience type *</label>
                <select className="input" value={audienceType} onChange={(e) => setAudienceType(e.target.value)}>
                  {audienceTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Audience size *</label>
                <select className="input" value={audienceSizeRange} onChange={(e) => setAudienceSizeRange(e.target.value)}>
                  {audienceSizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">How do you plan to promote Soul Care? *</label>
              <textarea className="input min-h-[100px]" required value={promotionPlan} onChange={(e) => setPromotionPlan(e.target.value)} />
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1" />
              <span>
                I agree to the{" "}
                <Link href="/affiliate/terms" className="font-semibold text-teal underline underline-offset-2" target="_blank">
                  Affiliate Terms
                </Link>
                , disclosure requirements, and promotion rules.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required checked={promotionRulesAccepted} onChange={(e) => setPromotionRulesAccepted(e.target.checked)} className="mt-1" />
              <span>I understand I may not make medical, clinical, therapeutic, income, or outcome guarantees.</span>
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}
