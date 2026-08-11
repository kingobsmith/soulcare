import PricingCard from "@/components/PricingCard";

export const GLOBAL_REACH =
  "SoulCare serves North America, South America, African Nations, Europe, and Asia in a growing global network.";

export function ConsumerPricingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PricingCard
        name="Listen & Guidance"
        price="$9.99"
        cadence="month"
        description="AI listening, encouragement, and general advice through Angel."
        disclaimer="Supportive guidance only. Not therapy, medical care, or a referral service."
        features={[
          "Daily Angel listening & encouragement",
          "Faith-sensitive spiritual guidance",
          "Crisis routing when needed",
          "Private member dashboard",
        ]}
        planKey="listen_guidance"
        accent="warm"
        ctaLabel="Checkout — $9.99/mo"
      />
      <PricingCard
        name="Preferred Care"
        price="$19.99"
        cadence="month"
        description="Chat support with help connecting to doctors, therapists, or your existing care team."
        features={[
          "Everything in Listen & Guidance",
          "Angel chat-back support",
          "Help connecting to doctors or therapists",
          "Liaison to your existing care team",
        ]}
        planKey="preferred_care"
        featured
        accent="warmPlus"
        ctaLabel="Checkout — $19.99/mo"
      />
    </div>
  );
}

export function ProfessionalPricingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PricingCard
        name="Professional Care"
        price="$49.99"
        cadence="month"
        description="For doctors, therapists, and pastors staying connected with the patients, clients, or people they already serve."
        features={[
          "Stay connected with people you already serve",
          "Communication & progress touchpoints",
          "Referral dashboard for your practice",
          "Part of the global Soul Care network",
        ]}
        planKey="professional_care"
        accent="pro"
        ctaLabel="Checkout — $49.99/mo"
      />
      <PricingCard
        name="Professional Growth"
        price="$99.99"
        cadence="month"
        description="Everything in Professional Care, plus opt-in leads for potential new patients, clients, or members."
        features={[
          "Everything in Professional Care",
          "Opt-in new patient & client inquiries",
          "Preferred placement for new leads",
          "For doctors, therapists & pastors",
        ]}
        planKey="professional_growth"
        featured
        accent="proPlus"
        ctaLabel="Checkout — $99.99/mo"
      />
    </div>
  );
}

export function AllPlansGrid() {
  return (
    <>
      <ConsumerPricingGrid />
      <div className="mt-10">
        <ProfessionalPricingGrid />
      </div>
    </>
  );
}
