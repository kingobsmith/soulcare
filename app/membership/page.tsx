import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import {
  GLOBAL_REACH,
  MemberPricingGrid,
  ProviderPricingGrid,
} from "@/components/PricingGrids";

export default function MembershipPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Membership</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Sign up now. Upgrade when it helps.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Start free with Angel. Companion Plus is $19.99/month with a 7-day free trial. Preferred
          Care is $29.99/month. Enter a promotion code at checkout if you have one.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-parchment/60">{GLOBAL_REACH}</p>
      </Section>

      <Section tone="parchment">
        <p className="eyebrow">Member plans</p>
        <div className="mt-6">
          <MemberPricingGrid />
        </div>

        <p className="mt-12 eyebrow">Provider plans</p>
        <div className="mt-6">
          <ProviderPricingGrid />
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
