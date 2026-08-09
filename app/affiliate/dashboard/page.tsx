import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";

export default async function AffiliateDashboard() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Section tone="parchment">
      <p className="eyebrow">Affiliate dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Phase 2</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Referral links, attribution, and commission payouts activate once the affiliate
        program policy is finalized (see <code>affiliate_profiles</code> and{" "}
        <code>affiliate_attributions</code> in the database schema). This route is
        scaffolded and auth-gated so you can build the UI directly on top of it.
      </p>
    </Section>
  );
}
