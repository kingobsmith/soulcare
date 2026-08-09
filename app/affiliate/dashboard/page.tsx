import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import { AffiliateReferralCard, AffiliateSupportCard } from "@/components/AffiliateDashboardParts";

export default async function AffiliateDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/affiliate/dashboard");

  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!affiliate) redirect("/affiliates/join");

  if (affiliate.status === "pending") {
    return (
      <Section tone="parchment">
        <p className="eyebrow">Affiliate dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Your affiliate application is under review.
        </h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Application received on {new Date(affiliate.applied_at).toLocaleDateString()}. We will
          notify you when your referral link is activated.
        </p>
        <p className="mt-2 text-sm text-ink/55">
          Approval is required before referral links and commissions are activated.
        </p>
      </Section>
    );
  }

  if (affiliate.status === "rejected") {
    return (
      <Section tone="parchment">
        <p className="eyebrow">Affiliate dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Your application was not approved at this time.
        </h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Thank you for your interest in partnering with Soul Care. You may contact us if you have
          questions about this decision.
        </p>
        <Link href="/contact" className="btn-secondary mt-6 inline-flex">
          Contact support
        </Link>
      </Section>
    );
  }

  if (affiliate.status === "suspended") {
    return (
      <Section tone="parchment">
        <p className="eyebrow">Affiliate dashboard</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Account access restricted</h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Your affiliate account is currently suspended. Referral links and commissions are inactive.
        </p>
        <AffiliateSupportCard />
      </Section>
    );
  }

  const [{ count: clicks }, { count: signups }, { count: qualified }] = await Promise.all([
    supabase
      .from("affiliate_clicks")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id),
    supabase
      .from("affiliate_attributions")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", user.id),
    supabase
      .from("affiliate_attributions")
      .select("*", { count: "exact", head: true })
      .eq("affiliate_id", user.id)
      .not("converted_at", "is", null),
  ]);

  return (
    <Section tone="parchment">
      <p className="eyebrow">Affiliate dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Your Soul Care Affiliate Dashboard</h1>
      <p className="mt-2 text-sm text-ink/60">
        Approved {affiliate.approved_at ? new Date(affiliate.approved_at).toLocaleDateString() : ""}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AffiliateReferralCard
          referralUrl={affiliate.referral_url || ""}
          referralCode={affiliate.referral_code || ""}
        />
        <div className="card">
          <h2 className="font-display text-lg font-semibold">Performance</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink/50">Link clicks</dt>
              <dd className="font-display text-2xl font-semibold text-teal">{clicks ?? 0}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Signups</dt>
              <dd className="font-display text-2xl font-semibold text-teal">{signups ?? 0}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Qualified memberships</dt>
              <dd className="font-display text-2xl font-semibold text-teal">{qualified ?? 0}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Pending commissions</dt>
              <dd className="font-display text-2xl font-semibold text-ink">$0</dd>
            </div>
            <div>
              <dt className="text-ink/50">Paid commissions</dt>
              <dd className="font-display text-2xl font-semibold text-ink">$0</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-ink/50">
            Commissions are paid only for qualifying paid memberships under the published commission
            policy. Payout processing is not yet active.
          </p>
        </div>
      </div>
    </Section>
  );
}
