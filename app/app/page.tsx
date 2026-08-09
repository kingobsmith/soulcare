import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import ManageBillingButton from "@/components/ManageBillingButton";
import Link from "next/link";

export default async function MemberDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: careMatches } = await supabase
    .from("care_match_requests")
    .select("id, status, created_at")
    .eq("member_id", user.id)
    .order("created_at", { ascending: false });

  const name = user.user_metadata?.full_name;

  return (
    <Section tone="parchment">
      <p className="eyebrow">Your dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Welcome{name ? `, ${name}` : ""}.
      </h1>

      <div className="mt-6 max-w-xl">
        <CrisisNote compact />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        {/* AI Companion — Coming Soon */}
        <div className="card border-2 border-dashed border-ink/15 bg-white/40">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-teal/10 p-3 text-2xl">🤝</div>
            <div>
              <h2 className="font-display text-xl font-semibold">AI Companion</h2>
              <span className="mt-1 inline-block rounded-full bg-brass/15 px-2.5 py-0.5 text-xs font-semibold text-brass-light">
                Coming soon
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-ink/65">
            A private, faith-sensitive listening companion is in development. It will
            include full crisis routing, session controls, and clear boundaries around
            clinical care. We'll notify you when it's ready.
          </p>
        </div>

        {/* Care-match requests */}
        <div className="card">
          <h2 className="font-display text-xl font-semibold">Provider interest requests</h2>
          {careMatches && careMatches.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm">
              {careMatches.map((c) => (
                <li key={c.id} className="flex justify-between border-b border-ink/10 pb-2">
                  <span className="capitalize text-teal">{c.status}</span>
                  <span className="text-ink/50">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink/60">
              No requests yet.{" "}
              <Link href="/care-match" className="font-semibold text-teal underline underline-offset-2">
                Express interest in a provider match →
              </Link>
            </p>
          )}
        </div>

        {/* Resources */}
        <div className="card">
          <h2 className="font-display text-xl font-semibold">Resources</h2>
          <p className="mt-2 text-sm text-ink/65">
            Faith-sensitive and general care reading to help you understand your options.
          </p>
          <Link href="/resources" className="btn-secondary mt-4 inline-flex">
            Browse resources
          </Link>
        </div>

        {/* Billing */}
        <div className="card">
          <h2 className="font-display text-xl font-semibold">Billing</h2>
          <p className="mt-2 text-sm text-ink/65">
            Manage your subscription, update your payment method, or view past invoices.
          </p>
          <div className="mt-4">
            <ManageBillingButton />
          </div>
        </div>

      </div>
    </Section>
  );
}
