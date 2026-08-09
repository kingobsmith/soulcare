import Link from "next/link";
import Section from "@/components/Section";

export default function AffiliateTermsPage() {
  return (
    <Section tone="parchment">
      <p className="eyebrow">Affiliate program</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Affiliate Terms</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-sm mt-8 max-w-3xl space-y-6 text-ink/80">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Required disclosure</h2>
          <p>
            Affiliates must clearly and conspicuously disclose their material relationship with Soul
            Care wherever they promote the platform. Example: &ldquo;I may receive a commission if
            you join Soul Care through my link.&rdquo;
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">No medical or clinical claims</h2>
          <p>
            You may not represent Soul Care as emergency care, clinical treatment, therapy, or a
            substitute for a licensed clinician. Angel and Soul Care provide supportive guidance and
            routing — not diagnosis or treatment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">No income guarantees</h2>
          <p>
            You may not promise specific earnings, commissions, or outcomes from participation in the
            affiliate program. Commissions depend on qualifying paid memberships under the published
            commission policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Prohibited promotion</h2>
          <p>
            No spam, fake reviews, fake accounts, deceptive tactics, or misleading statements. Do not
            collect or share private health information through affiliate activities.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Approval and termination</h2>
          <p>
            Soul Care may reject, suspend, or terminate any affiliate at any time. Referral links and
            commissions activate only after written approval. Payouts are issued only for qualifying
            paid memberships under the published commission policy.
          </p>
        </section>
      </div>

      <Link href="/affiliates/join" className="btn-primary mt-10 inline-flex">
        Apply to become an affiliate
      </Link>
    </Section>
  );
}
