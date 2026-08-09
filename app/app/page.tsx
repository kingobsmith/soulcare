import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import ManageBillingButton from "@/components/ManageBillingButton";
import AngelChat from "@/components/AngelChat";
import CareTeamPanel from "@/components/CareTeamPanel";
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
      <p className="mt-2 max-w-2xl text-sm text-ink/65">
        Soul Care is your liaison between daily support and your therapist, doctor, and pastor.
        Angel listens daily; your care team receives progress when you&apos;re ready.
      </p>

      <div className="mt-6 max-w-xl">
        <CrisisNote compact />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AngelChat />
        <CareTeamPanel />

        <div className="card">
          <h2 className="font-display text-xl font-semibold">Provider match status</h2>
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
                Request a provider match →
              </Link>
            </p>
          )}
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-semibold">Resources</h2>
          <p className="mt-2 text-sm text-ink/65">
            Faith-sensitive and general care reading to help you understand your options.
          </p>
          <Link href="/resources" className="btn-secondary mt-4 inline-flex">
            Browse resources
          </Link>
        </div>

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
