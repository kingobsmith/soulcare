import Link from "next/link";
import Section from "@/components/Section";
import { GLOBAL_REACH, ProfessionalPricingGrid } from "@/components/PricingGrids";

export default function ProvidersPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">For professionals</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl text-balance">
          Stay connected with the people you serve.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Doctors and therapists support patients and clients. Pastors support members and people
          they serve. Soul Care helps you stay in touch — and optionally receive new opt-in leads.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-brass-light/90">{GLOBAL_REACH}</p>
        <Link href="/providers/apply" className="btn-gold mt-6 inline-flex">
          Apply to the network
        </Link>
      </Section>

      <Section tone="parchment">
        <p className="eyebrow">Professional plans</p>
        <div className="mt-6">
          <ProfessionalPricingGrid />
        </div>
        <p className="mt-6 text-xs text-ink/50">
          Soul Care supports connection and communication — not a HIPAA-compliant medical-records
          system. Apply for verification before your profile goes live.
        </p>
      </Section>
    </>
  );
}
