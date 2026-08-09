import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";

// This page assumes a `role` column on `profiles` set server-side (never trust
// a client flag). See supabase/migrations/0001_init.sql and the README section
// on assigning the admin role.
export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return (
      <Section tone="parchment">
        <h1 className="font-display text-2xl font-semibold">Admins only</h1>
        <p className="mt-3 text-ink/70">
          This area is restricted to Soul Care admin accounts.
        </p>
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
    .select("id, status, created_at")
    .eq("status", "submitted")
    .order("created_at", { ascending: true });

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
            {pendingMatches?.map((m) => (
              <li key={m.id} className="rounded-lg border border-ink/10 p-3">
                <div className="font-medium capitalize">{m.status}</div>
                <div className="text-ink/60">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </li>
            ))}
            {(!pendingMatches || pendingMatches.length === 0) && (
              <p className="text-ink/50">No pending requests.</p>
            )}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-xs text-ink/50">
        This is a read-only starter view. Add update actions (approve, reject, request
        info, assign referral) as server actions or API routes using the service-role
        client, and log every action to <code>audit_logs</code>.
      </p>
    </Section>
  );
}
