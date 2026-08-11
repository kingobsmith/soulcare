import Link from "next/link";
import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import HeroVideo from "@/components/HeroVideo";
import {
  GLOBAL_REACH,
  ConsumerPricingGrid,
  ProfessionalPricingGrid,
} from "@/components/PricingGrids";

export default function HomePage() {
  return (
    <>
      <HeroVideo />

      <Section tone="parchment" id="plans">
        <p className="eyebrow">Plans</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Choose your path</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink/65">{GLOBAL_REACH}</p>

        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-teal">
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
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Trust &amp; privacy</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Warm support. Clear boundaries.</h2>
          <div className="mt-6 grid gap-4 text-left text-sm text-ink/70 sm:grid-cols-3">
            <div className="rounded-xl border border-ink/10 bg-parchment/40 p-4">
              <strong className="text-ink">Private by default</strong>
              <p className="mt-1">Your conversations stay yours. We don&apos;t sell your data.</p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-parchment/40 p-4">
              <strong className="text-ink">Connection, not records</strong>
              <p className="mt-1">
                Soul Care helps people connect and communicate — not a medical-records or HIPAA
                patient-management system.
              </p>
            </div>
            <div className="rounded-xl border border-ink/10 bg-parchment/40 p-4">
              <strong className="text-ink">Real humans matter</strong>
              <p className="mt-1">
                Angel supports daily life; licensed professionals handle clinical care.
              </p>
            </div>
          </div>
          <Link href="/privacy" className="mt-6 inline-block text-sm font-semibold text-teal underline underline-offset-2">
            Read our privacy policy →
          </Link>
        </div>
      </Section>

      <Section tone="parchment">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-semibold">Affiliate partners welcome</p>
            <p className="mt-1 text-sm text-ink/65">Help people discover Soul Care across the globe.</p>
          </div>
          <Link href="/affiliates" className="btn-secondary">
            Affiliate Program
          </Link>
        </div>
        <div className="mt-10">
          <CrisisNote compact />
        </div>
      </Section>
    </>
  );
}
