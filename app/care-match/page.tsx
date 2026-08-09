"use client";

import { useState } from "react";
import Section from "@/components/Section";

export default function CareMatchPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      state: form.get("state"),
      servicePreference: form.get("servicePreference"),
    };

    try {
      const res = await fetch("/api/care-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <Section tone="parchment">
        <div className="max-w-xl">
          <h1 className="font-display text-3xl font-semibold">Interest received</h1>
          <p className="mt-3 text-ink/70">
            Thank you. A member of the Soul Care team will follow up with you about
            available providers in your area.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="parchment">
      <div className="max-w-xl">
        <p className="eyebrow">Care match</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Express interest in care
        </h1>

        <div className="mt-4 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-xs text-ink/75">
          <strong>Crisis notice:</strong> If you are in immediate danger, call 911 or
          text/call <strong>988</strong>. This form is not an emergency or clinical intake
          channel.{" "}
          <a href="/crisis" className="font-semibold underline underline-offset-2">
            Crisis resources →
          </a>
        </div>

        <p className="mt-4 text-sm text-ink/60">
          Please do not include private medical information, diagnoses, therapy notes, or
          crisis details in this form.
        </p>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-white/60 p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <p className="font-display text-lg font-semibold">AI Companion</p>
              <p className="text-xs text-ink/60">Coming soon</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-ink/65">
            A private, faith-sensitive listening companion is in development. When it
            launches, it will be available from your member dashboard — with full crisis
            routing, session controls, and a clear boundary around what it can and cannot
            do. Until then, use this form to express interest in being matched with a
            licensed provider.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div>
            <label className="label">Full name</label>
            <input name="name" required className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">State</label>
            <input name="state" required className="input" placeholder="e.g. Georgia" />
          </div>
          <div>
            <label className="label">General service preference</label>
            <select name="servicePreference" required className="input">
              <option value="">Select one</option>
              <option value="individual_therapy">Individual counseling or therapy</option>
              <option value="couples">Couples or marriage counseling</option>
              <option value="family">Family counseling</option>
              <option value="grief">Grief or loss support</option>
              <option value="faith_pastoral">Faith-sensitive or pastoral care</option>
              <option value="general_support">General support — not sure yet</option>
            </select>
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary w-fit disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting…" : "Submit interest"}
          </button>
        </form>
      </div>
    </Section>
  );
}
