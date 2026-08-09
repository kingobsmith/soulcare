"use client";

import { useEffect, useRef, useState } from "react";

type Message = { id?: string; role: string; content: string; created_at?: string };

export default function AngelChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/angel")
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/angel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((m) => [...m, { role: "angel", content: data.reply }]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card flex h-[420px] flex-col">
      <div className="flex items-start gap-3 border-b border-ink/10 pb-4">
        <div className="rounded-xl bg-teal/10 p-2 text-xl">✨</div>
        <div>
          <h2 className="font-display text-xl font-semibold">Angel</h2>
          <p className="text-xs text-ink/60">
            Daily listening & spiritual guidance — a voice of reason until your care team weighs in.
          </p>
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
        {messages.length === 0 && (
          <p className="text-ink/50">
            Good to see you. Angel is here to listen, encourage sound spiritual reflection, and help
            bridge you to your therapist, doctor, and pastor.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] rounded-2xl px-3 py-2 ${
              m.role === "user" ? "ml-auto bg-teal text-white" : "bg-ink/5 text-ink"
            }`}
          >
            {m.role === "angel" && <div className="mb-1 text-xs font-semibold text-teal">Angel</div>}
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Share what's on your heart…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={2000}
        />
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
