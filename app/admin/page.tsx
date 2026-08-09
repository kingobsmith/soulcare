import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import { ProviderAdminActions } from "@/components/ProviderAdminActions";
import { CareMatchAdminActions } from "@/components/CareMatchAdminActions";
import { AffiliateAdminActions } from "@/components/AffiliateAdminActions";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <Section tone="parchment">
        <h1 className="font-display text-2xl font-semibold">Admins only</h1>
        <p className="mt-3 text-ink/70">This area is restricted to Soul Care admin accounts.</p>
      </Section>
    );
  }

  const { data: pendingProviders } = await supabase
    .from("provider_profiles")
    .select("id, public_name, legal_name, credential_type, verification_status, created_at")
    .in("verification_status", ["submitted", "under_review", "needs_information"])
    .order("created_at", { ascending: true });

  const { data: pendingMatches } = await supabase
    .from("care_match_requests")
    .select("id, status, preference_summary, created_at")
    .in("status", ["submitted", "reviewing"])
    .order("created_at", { ascending: true });

  const { data: verifiedProviders } = await supabase
    .from("provider_profiles")
    .select("id, public_name")
    .eq("verification_status", "verified")
    .order("public_name");

  const { data: affiliateApps } = await supabase
    .from("affiliates")
    .select("*")
    .order("applied_at", { ascending: true });

  const pendingAffiliates = affiliateApps?.filter((a) => a.status === "pending") ?? [];
  const otherAffiliates = affiliateApps?.filter((a) => a.status !== "pending") ?? [];

  return (
    <Section tone="parchment">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Review queue</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-lg font-semibold">
            Provider applications ({pendingProviders?.length ?? 0})
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {pendingProviders?.map((p) => (
              <li key={p.id} className="rounded-lg border border-ink/10 p-3">
                <div className="font-medium">{p.public_name}</div>
                <div className="text-ink/60">{p.credential_type}</div>
                <div className="mt-1 text-xs capitalize text-teal">{p.verification_status}</div>
                <ProviderAdminActions providerId={p.id} />
              </li>
            ))}
            {(!pendingProviders || pendingProviders.length === 0) && (
              <p className="text-ink/50">No pending applications.</p>
            )}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-semibold">
            Care-match requests ({pendingMatches?.length ?? 0})
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {pendingMatches?.map((m) => {
              const pref = m.preference_summary as Record<string, string> | null;
              return (
                <li key={m.id} className="rounded-lg border border-ink/10 p-3">
                  <div className="font-medium capitalize">{m.status}</div>
                  {pref && (
                    <div className="mt-1 text-ink/70">
                      {pref.name} · {pref.state} · {pref.servicePreference}
                    </div>
                  )}
                  <div className="text-ink/60">{new Date(m.created_at).toLocaleString()}</div>
                  <CareMatchAdminActions
                    requestId={m.id}
                    providers={verifiedProviders ?? []}
                  />
                </li>
              );
            })}
            {(!pendingMatches || pendingMatches.length === 0) && (
              <p className="text-ink/50">No pending requests.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-10 card">
        <h2 className="font-display text-lg font-semibold">
          Affiliate applications ({pendingAffiliates.length})
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          {pendingAffiliates.map((a) => (
            <li key={a.id} className="rounded-lg border border-ink/10 p-3">
              <div className="font-medium">{a.legal_name}</div>
              <div className="text-ink/60">{a.organization_name || a.audience_type}</div>
              <div className="mt-1 text-xs text-ink/50">{a.city}, {a.country}</div>
              <p className="mt-2 text-xs text-ink/65">{a.promotion_plan}</p>
              <AffiliateAdminActions affiliateId={a.id} />
            </li>
          ))}
          {pendingAffiliates.length === 0 && (
            <p className="text-ink/50">No pending affiliate applications.</p>
          )}
        </ul>

        {otherAffiliates.length > 0 && (
          <div className="mt-8 border-t border-ink/10 pt-6">
            <h3 className="font-display text-base font-semibold">All affiliates</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {otherAffiliates.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink/10 p-3">
                  <div>
                    <span className="font-medium">{a.legal_name}</span>
                    <span className="ml-2 capitalize text-teal">{a.status}</span>
                    {a.referral_code && (
                      <span className="ml-2 text-xs text-ink/50">{a.referral_code}</span>
                    )}
                  </div>
                  {a.status !== "rejected" && <AffiliateAdminActions affiliateId={a.id} />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}
