"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Section from "@/components/Section";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  function getNext() {
    if (typeof window === "undefined") return "/app";
    return new URLSearchParams(window.location.search).get("next") || "/app";
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    window.location.href = getNext();
  }

  async function handleMagicLink() {
    setStatus("loading");
    const next = getNext();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${next}` },
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  const signupHref =
    typeof window !== "undefined"
      ? `/signup?next=${encodeURIComponent(getNext())}`
      : "/signup";

  return (
    <Section tone="parchment" className="flex justify-center">
      <div className="card w-full max-w-md">
        <h1 className="font-display text-2xl font-semibold">Log in</h1>
        <p className="mt-2 text-sm text-ink/60">Required before checkout.</p>
        {status === "sent" ? (
          <p className="mt-4 text-sm text-ink/70">Check your email for a magic sign-in link.</p>
        ) : (
          <form onSubmit={handlePasswordLogin} className="mt-6 grid gap-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
            <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-60">
              Log in
            </button>
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={status === "loading" || !email}
              className="btn-secondary disabled:opacity-60"
            >
              Email me a magic link instead
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-ink/60">
          No account yet?{" "}
          <Link href={signupHref} className="font-semibold text-teal underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </Section>
  );
}
