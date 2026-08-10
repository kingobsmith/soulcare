import PricingCard from "@/components/PricingCard";

export const GLOBAL_REACH =
  "SoulCare serves North America, South America, African Nations, Europe, and Asia in a growing global network.";

export function MemberPricingGrid({ featuredPlan = "companion_plus" }: { featuredPlan?: string }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <PricingCard
        name="Companion"
        price="Free"
        description="Sign up free — Angel, resources, crisis routing, and your member dashboard."
        features={[
          "Free account signup",
          "Angel daily check-ins",
          "Resource library",
          "Crisis routing",
        ]}
        planKey={null}
        ctaLabel="Sign up free"
      />
      <PricingCard
        name="Companion Plus"
        price="$19.99"
        cadence="month"
        description="Angel plus care team progress reports. 7-day free trial — cancel anytime."
        features={[
          "7-day free trial",
          "Angel daily check-ins",
          "Care team progress reports",
          "Priority provider routing",
        ]}
        planKey="companion_plus"
        featured={featuredPlan === "companion_plus"}
        ctaLabel="Start 7-day free trial"
      />
      <PricingCard
        name="Preferred Care"
        price="$29.99"
        cadence="month"
        description="Angel chat-back plus help connecting to doctors and therapists."
        features={[
          "Everything in Companion Plus",
          "Angel chat-back support",
          "Doctor & therapist connection help",
          "Priority care team liaison",
        ]}
        planKey="preferred_care"
        featured={featuredPlan === "preferred_care"}
        ctaLabel="Choose Preferred Care"
      />
      <PricingCard
        name="Therapy Session"
        price="$50"
        cadence="session"
        description="One booked session with a verified, licensed provider."
        features={[
          "One booked session",
          "Verified, licensed provider",
          "Faith & language matching",
          "Secure scheduling",
        ]}
        planKey="therapy_session"
        ctaLabel="Book a session"
      />
    </div>
  );
}

export function ProviderPricingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PricingCard
        name="Provider Network"
        price="$49.99"
        cadence="month"
        description="Join the global Soul Care provider network."
        features={[
          "Track patients in your referral dashboard",
          "Verified profile in the global network",
          "Accept or decline referrals on your terms",
          "Stripe Connect payouts after sessions",
        ]}
        planKey="provider_network"
        ctaLabel="Join Provider Network"
      />
      <PricingCard
        name="Preferred Provider"
        price="$99.99"
        cadence="month"
        description="Stand out as a preferred provider in the Soul Care network."
        features={[
          "Preferred provider status & badge",
          "Receive new patient inquiries and leads",
          "Priority placement in member matching",
          "Everything in Provider Network",
        ]}
        planKey="preferred_provider"
        featured
        ctaLabel="Become a Preferred Provider"
      />
    </div>
  );
}
