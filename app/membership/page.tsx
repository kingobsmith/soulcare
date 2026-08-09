import Section from "@/components/Section";
import PricingCard from "@/components/PricingCard";
import CrisisNote from "@/components/CrisisNote";

export default function MembershipPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Membership</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Sign up now. Upgrade when it helps.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Start free with Angel. Companion Plus includes a 7-day free trial, then $9.99/month.
          You can apply a promotion code at checkout.
        </p>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard
            name="Companion"
            price="Free"
            description="Sign up free — Angel, resources, crisis routing, and your member dashboard."
            features={[
              "Free account signup",
              "Angel daily check-ins",
              "Resource library",
              "Crisis routing"
            ]}
            planKey={null}
            ctaLabel="Sign up free"
          />
          <PricingCard
            name="Companion Plus"
            price="$9.99"
            cadence="month"
            description="7-day free trial, then $9.99/month. Angel plus care team progress reports."
            features={[
              "7-day free trial",
              "Angel daily check-ins",
              "Care team progress reports",
              "Priority provider routing"
            ]}
            planKey="companion_plus"
            featured
            ctaLabel="Start 7-day free trial"
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
          <strong className="text-ink">Promotion codes.</strong> Have a coupon? Enter it on the
          Stripe checkout page — click &ldquo;Add promotion code&rdquo; before you pay.
        </div>

        <div className="mt-8">
          <CrisisNote />
        </div>
      </Section>
    </>
  );
}
