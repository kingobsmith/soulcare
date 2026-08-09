"use client";

import { useEffect, useState } from "react";

type Member = { role: string; name: string; email: string };

const roles = [
  { key: "therapist", label: "Therapist" },
  { key: "doctor", label: "Doctor" },
  { key: "pastor", label: "Pastor" },
];

export default function CareTeamPanel() {
  const [members, setMembers] = useState<Member[]>([
    { role: "therapist", name: "", email: "" },
    { role: "doctor", name: "", email: "" },
    { role: "pastor", name: "", email: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/care-team")
      .then((r) => r.json())
      .then((d) => {
        if (d.members?.length) {
          const next = roles.map((r) => {
            const found = d.members.find((m: Member) => m.role === r.key);
            return found || { role: r.key, name: "", email: "" };
          });
          setMembers(next);
        }
      })
      .catch(() => {});
  }, []);

  function update(role: string, field: "name" | "email", value: string) {
    setMembers((m) => m.map((x) => (x.role === role ? { ...x, [field]: value } : x)));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/care-team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members }),
    });
    setSaving(false);
    setMsg(res.ok ? "Care team saved." : "Could not save.");
  }

  async function sendReport() {
    setSending(true);
    setMsg("");
    const res = await fetch("/api/progress-report", { method: "POST" });
    const data = await res.json();
    setSending(false);
    setMsg(res.ok ? `Report sent to ${data.sentTo} care team member(s).` : data.error || "Could not send.");
  }

  return (
    <div className="card">
      <h2 className="font-display text-xl font-semibold">Your care team</h2>
      <p className="mt-1 text-sm text-ink/60">
        Soul Care liaises between you and your therapist, doctor, and pastor. Angel can send them a
        progress summary from your check-ins.
      </p>
      <div className="mt-4 space-y-3">
        {roles.map((r) => {
          const m = members.find((x) => x.role === r.key)!;
          return (
            <div key={r.key} className="grid gap-2 sm:grid-cols-2">
              <input
                className="input"
                placeholder={`${r.label} name`}
                value={m.name}
                onChange={(e) => update(r.key, "name", e.target.value)}
              />
              <input
                className="input"
                type="email"
                placeholder={`${r.label} email`}
                value={m.email}
                onChange={(e) => update(r.key, "email", e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={save} disabled={saving} className="btn-secondary disabled:opacity-60">
          {saving ? "Saving…" : "Save care team"}
        </button>
        <button onClick={sendReport} disabled={sending} className="btn-primary disabled:opacity-60">
          {sending ? "Sending…" : "Send progress report"}
        </button>
      </div>
      {msg && <p className="mt-3 text-sm text-teal">{msg}</p>}
    </div>
  );
}
