import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import ManageBillingButton from "@/components/ManageBillingButton";
import ConnectOnboardButton from "@/components/ConnectOnboardButton";

const statusCopy: Record<string, string> = {
  submitted: "Your application has been submitted and is awaiting review.",
  under_review: "Our admin team is currently reviewing your credentials.",
  needs_information: "We need more information before we can verify you.",
  verified: "You're verified! Your profile is live and eligible for referrals.",
  rejected: "Your application was not approved at this time.",
  suspended: "Your provider account is currently suspended."
};

export default async function ProviderDashboard() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: provider } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!provider) {
    return (
      <Section tone="parchment">
        <h1 className="font-display text-3xl font-semibold">Provider dashboard</h1>
        <p className="mt-3 text-ink/70">You haven&apos;t submitted a provider application yet.</p>
        <a href="/providers/apply" className="btn-primary mt-6 inline-flex">
          Apply now
        </a>
      </Section>
    );
  }

  const { data: referrals } = await supabase
    .from("referrals")
    .select("id, status, assigned_at, care_match_requests(preference_summary)")
    .eq("provider_id", provider.id)
    .order("assigned_at", { ascending: false });

  return (
    <Section tone="parchment">
      <p className="eyebrow">Provider dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{provider.public_name}</h1>

      <div className="mt-6 card max-w-xl">
        <h2 className="font-display text-lg font-semibold">Verification status</h2>
        <p className="mt-2 text-sm capitalize text-teal">{provider.verification_status}</p>
        <p className="mt-1 text-sm text-ink/70">
          {statusCopy[provider.verification_status] || "Status pending."}
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-lg font-semibold">Payouts</h2>
          <p className="mt-2 text-sm text-ink/70">
            Connect a Stripe Express account to receive session payouts.
          </p>
          <div className="mt-4">
            <ConnectOnboardButton disabled={provider.verification_status !== "verified"} />
          </div>
        </div>
        <div className="card">
          <h2 className="font-display text-lg font-semibold">Provider Network billing</h2>
          <p className="mt-2 text-sm text-ink/70">
            Manage your $49.99/month Provider Network subscription.
          </p>
          <div className="mt-4">
            <ManageBillingButton />
          </div>
        </div>
      </div>

      <div className="mt-6 card">
        <h2 className="font-display text-lg font-semibold">Referral inbox</h2>
        {referrals && referrals.length > 0 ? (
          <ul className="mt-3 space-y-3 text-sm">
            {referrals.map((r) => {
              const match = r.care_match_requests as { preference_summary?: Record<string, string> } | null;
              const pref = match?.preference_summary;
              return (
                <li key={r.id} className="rounded-lg border border-ink/10 p-3">
                  <div className="capitalize text-teal">{r.status}</div>
                  {pref && (
                    <div className="mt-1 text-ink/70">
                      {pref.state} · {pref.servicePreference}
                    </div>
                  )}
                  <div className="text-xs text-ink/50">
                    {r.assigned_at ? new Date(r.assigned_at).toLocaleString() : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink/60">No referrals yet. Matches appear here when admin assigns you.</p>
        )}
      </div>
    </Section>
  );
}
