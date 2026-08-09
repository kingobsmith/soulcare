"use client";

import { useState } from "react";

export default function CareMatchForm() {
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
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-semibold">Request received</h2>
        <p className="mt-3 text-ink/70">
          Thank you. A member of the Soul Care team will follow up about available providers in
          your area.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid max-w-xl gap-5">
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
      {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-fit disabled:opacity-60">
        {status === "submitting" ? "Submitting…" : "Submit provider request"}
      </button>
    </form>
  );
}
