import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import {
  GLOBAL_REACH,
  ConsumerPricingGrid,
  ProfessionalPricingGrid,
} from "@/components/PricingGrids";

export default function MembershipPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Membership</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">Choose your plan</h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Four plans. One checkout button each. Promotion codes accepted at Stripe checkout.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-parchment/60">{GLOBAL_REACH}</p>
      </Section>

      <Section tone="parchment">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal">
          For individuals &amp; families
        </p>
        <div className="mt-4">
          <ConsumerPricingGrid />
        </div>

        <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-teal">
          For doctors, therapists &amp; pastors
        </p>
        <div className="mt-4">
          <ProfessionalPricingGrid />
        </div>

        <div className="mt-10">
          <CrisisNote />
        </div>
      </Section>
    </>
  );
}
