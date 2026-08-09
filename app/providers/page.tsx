import Link from "next/link";
import Section from "@/components/Section";
import PricingCard from "@/components/PricingCard";

const benefits = [
  "Verified professional profile with specialty, language, and faith-preference matching",
  "Availability controls you set and change any time",
  "A referral dashboard — accept or decline, on your terms",
  "Stripe Connect payouts after completed sessions",
  "Access to affiliate and community-partner referral tools"
];

export default function ProvidersPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">For licensed providers</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Referrals from people who are ready for you.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Soul Care does the hard first conversation. By the time a member reaches you,
          they've named what they need and been matched on specialty, language, faith
          preference, and location.
        </p>
        <Link href="/providers/apply" className="btn-gold mt-6 inline-flex">
          Apply to join the network
        </Link>
      </Section>

      <Section tone="parchment">
        <p className="eyebrow">What you get</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <li key={b} className="card !p-5 text-sm">
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <p className="eyebrow">Provider network pricing</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="font-display text-2xl font-semibold">Apply</h3>
            <div className="mt-2 text-3xl font-semibold">Free</div>
            <p className="mt-3 text-sm text-ink/70">
              Submit your credentials for review. No public listing or referrals until
              you're verified.
            </p>
            <Link href="/providers/apply" className="btn-secondary mt-8 w-full">
              Start application
            </Link>
          </div>
          <PricingCard
            name="Provider Network"
            price="$49.99"
            cadence="month"
            description="Verified profile, matching eligibility, referral dashboard, availability controls, and affiliate/referral tools."
            features={[
              "Verified public profile",
              "Matching eligibility",
              "Referral dashboard",
              "Availability controls",
              "Affiliate & referral tools"
            ]}
            planKey="provider_network"
            featured
            ctaLabel="Subscribe after verification"
          />
          <div className="card">
            <span className="mb-3 inline-block w-fit rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              Limited offer
            </span>
            <h3 className="font-display text-2xl font-semibold">Founding Provider</h3>
            <div className="mt-2 text-3xl font-semibold">Locked rate</div>
            <p className="mt-3 text-sm text-ink/70">
              Same network access with a founder badge and a locked introductory price.
              Capped in number and by date — ask during your application.
            </p>
            <Link href="/providers/apply" className="btn-secondary mt-8 w-full">
              Ask about founding pricing
            </Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-ink/50">
          Provider Network billing activates only after your application is verified by
          the Soul Care admin team.
        </p>
      </Section>
    </>
  );
}
