"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Section from "@/components/Section";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  function getNext() {
    if (typeof window === "undefined") return "/app";
    return new URLSearchParams(window.location.search).get("next") || "/app";
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const next = getNext();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}${next}`,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    if (data.user?.id) {
      await fetch("/api/affiliates/attribute", { method: "POST" });
    }
    if (data.session) {
      window.location.href = next;
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <Section tone="parchment" className="text-center">
        <h1 className="font-display text-2xl font-semibold">Check your email</h1>
        <p className="mt-3 text-ink/70">Confirm your account to finish signing up, then continue checkout.</p>
      </Section>
    );
  }

  return (
    <Section tone="parchment" className="flex justify-center">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-ink/60">Required before checkout.</p>
        <form onSubmit={handleSignup} className="mt-6 grid gap-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
          <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-60">
            Sign up
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? getNext() : "/app")}`}
            className="font-semibold text-teal underline underline-offset-2"
          >
            Log in
          </Link>
        </p>
      </div>
    </Section>
  );
}
