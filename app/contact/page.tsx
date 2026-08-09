"use client";

import { useState } from "react";
import Section from "@/components/Section";

const topics = [
  { value: "general", label: "General question" },
  { value: "provider", label: "Provider Network" },
  { value: "partnership", label: "Church / community partnership" },
  { value: "affiliate", label: "Affiliate program" },
  { value: "billing", label: "Billing support" },
  { value: "technical", label: "Technical support" },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setErrorMsg("Please check the consent box before sending.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      topic: form.get("topic"),
      message: form.get("message"),
      consent: true,
    };

    try {
      const res = await fetch("/api/contact", {
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
          <h1 className="font-display text-3xl font-semibold">Message sent</h1>
          <p className="mt-3 text-ink/70">
            Thank you — someone from the Soul Care team will follow up at the email you
            provided.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="parchment">
      <div className="max-w-xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Get in touch</h1>
        <p className="mt-3 text-sm text-ink/70">
          For partnerships, provider questions, and general support only. This form is{" "}
          <strong>not</strong> a care intake or emergency channel.
        </p>

        <div className="mt-4 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-xs text-ink/75">
          If you are in immediate danger or crisis, call 911 or text/call{" "}
          <strong>988</strong> (U.S. Suicide &amp; Crisis Lifeline). Do not use this form
          for emergencies.{" "}
          <a href="/crisis" className="font-semibold underline underline-offset-2">
            See crisis resources →
          </a>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-5">
          <div>
            <label className="label">Name</label>
            <input name="name" required className="input" placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="label">Topic</label>
            <select name="topic" required className="input">
              <option value="">Select a topic</option>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              className="input"
              placeholder="How can we help?"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-ink/30 accent-teal"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span className="text-xs text-ink/65">
              I understand I should <strong>not</strong> submit private health, crisis,
              medical, therapy, payment-card, or other sensitive information through this
              form.
            </span>
          </label>

          {status === "error" && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary w-fit disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </Section>
  );
}
