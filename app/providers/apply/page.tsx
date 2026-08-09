"use client";

import { useState } from "react";
import Section from "@/components/Section";

export default function ProviderApplyPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);

    const payload = {
      legalName: form.get("legalName"),
      publicName: form.get("publicName"),
      credentialType: form.get("credentialType"),
      licenseState: form.get("licenseState"),
      specialties: String(form.get("specialties") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: String(form.get("languages") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      faithPreferences: String(form.get("faithPreferences") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      modalities: String(form.get("modalities") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      bio: form.get("bio")
    };

    try {
      const res = await fetch("/api/provider/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data?.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <Section tone="parchment" className="text-center">
        <h1 className="font-display text-3xl font-semibold">Application received</h1>
        <p className="mt-3 text-ink/70">
          Thank you. Our admin team manually reviews every provider application, including
          license, credentials, and insurance documentation. We'll email you at the address
          on file with your status.
        </p>
      </Section>
    );
  }

  return (
    <Section tone="parchment">
      <p className="eyebrow">Provider application</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Apply in about 6 minutes</h1>
      <p className="mt-3 max-w-xl text-sm text-ink/60">
        You must be logged in to submit an application. Documents (CV, headshot, malpractice
        insurance) can be uploaded from your provider dashboard after this form is submitted.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid max-w-2xl gap-5">
        <div>
          <label className="label">Legal name</label>
          <input name="legalName" required className="input" placeholder="Jane A. Doe" />
        </div>
        <div>
          <label className="label">Public display name</label>
          <input name="publicName" required className="input" placeholder="Dr. Jane Doe, LPC" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Credential type</label>
            <select name="credentialType" required className="input">
              <option value="">Select one</option>
              <option>Licensed Professional Counselor (LPC)</option>
              <option>Licensed Clinical Social Worker (LCSW)</option>
              <option>Psychologist (PhD/PsyD)</option>
              <option>Psychiatrist (MD/DO)</option>
              <option>Marriage & Family Therapist (LMFT)</option>
              <option>Pastoral Counselor</option>
              <option>Other licensed professional</option>
            </select>
          </div>
          <div>
            <label className="label">License state</label>
            <input name="licenseState" required className="input" placeholder="GA" />
          </div>
        </div>
        <div>
          <label className="label">Specialties (comma separated)</label>
          <input name="specialties" className="input" placeholder="Anxiety, grief, marriage counseling" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Languages (comma separated)</label>
            <input name="languages" className="input" placeholder="English, Spanish" />
          </div>
          <div>
            <label className="label">Faith preferences you serve (comma separated)</label>
            <input name="faithPreferences" className="input" placeholder="Christian, faith-neutral" />
          </div>
        </div>
        <div>
          <label className="label">Modalities (comma separated)</label>
          <input name="modalities" className="input" placeholder="Video, phone, in-person" />
        </div>
        <div>
          <label className="label">Short professional bio</label>
          <textarea name="bio" rows={5} className="input" placeholder="Tell members about your approach to care." />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <button type="submit" disabled={status === "submitting"} className="btn-primary w-fit disabled:opacity-60">
          {status === "submitting" ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </Section>
  );
}
