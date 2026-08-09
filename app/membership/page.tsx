import Section from "@/components/Section";
import PricingCard from "@/components/PricingCard";
import CrisisNote from "@/components/CrisisNote";

export default function MembershipPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Membership</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Start free. Upgrade when it helps.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Every plan starts with the companion. Paid tiers add depth, priority routing,
          and access to booked sessions with a licensed provider.
        </p>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            name="Companion"
            price="Free"
            description="Guided AI listening, resource library, crisis routing, saved support preferences."
            features={[
              "Guided AI listening companion",
              "Resource library",
              "Crisis routing",
              "Saved support preferences"
            ]}
            planKey={null}
            ctaLabel="Start free"
          />
          <PricingCard
            name="Companion Plus"
            price="$9"
            cadence="month"
            description="Expanded companion access, journaling, and priority care-match routing."
            features={[
              "Expanded AI companion",
              "Journal & check-ins",
              "Care-match request",
              "Priority support routing"
            ]}
            planKey="companion_plus"
            featured
            ctaLabel="Choose Companion Plus"
          />
          <PricingCard
            name="Therapy Session"
            price="$50"
            cadence="session"
            description="One booked session with a verified provider, matched to your preferences."
            features={[
              "One booked session",
              "Verified, licensed provider",
              "Faith & language matching",
              "Secure scheduling"
            ]}
            planKey="therapy_session"
            ctaLabel="Book a session"
          />
        </div>

        <div className="mt-10 rounded-2xl border border-ink/10 bg-white p-6 text-sm text-ink/60">
          <strong className="text-ink">A note on Care Membership.</strong> A bundled
          multi-session monthly plan is planned for a future phase, once provider capacity
          and payout economics are finalized. Today, sessions are booked and paid
          individually so pricing always matches what's actually delivered.
        </div>

        <div className="mt-8">
          <CrisisNote />
        </div>
      </Section>
    </>
  );
}
