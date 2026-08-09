import Link from "next/link";
import Section from "@/components/Section";

const prohibited = [
  "Make medical, clinical, therapeutic, income, or outcome guarantees",
  "Claim Soul Care is emergency care or a replacement for a licensed clinician",
  "Use spam, fake reviews, fake accounts, or misleading statements",
  "Promote to minors without approved guardian-consent workflows",
  "Collect or share private health information through affiliate activities",
  "Imply affiliation with a government agency, hospital, insurer, or church without written permission",
];

export default function AffiliatesPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Affiliate program</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Partner with Soul Care.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Churches, community organizations, and approved partners can help connect
          people to Soul Care and earn a share of the impact they create.
        </p>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card">
            <span className="mb-3 inline-block w-fit rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              Dashboard launching soon
            </span>
            <h2 className="font-display text-2xl font-semibold">How it works</h2>
            <p className="mt-3 text-sm text-ink/70">
              Approved affiliates receive a unique referral link and earn a commission on
              qualifying paid memberships they introduce. Commissions are paid monthly
              after a holding period, once the affiliate policy and agreement are
              finalized.
            </p>
            <p className="mt-3 text-sm text-ink/70">
              The affiliate dashboard — referral links, attribution tracking, and payout
              reporting — is in development. Payouts will not activate until the
              commission agreement, tracking rules, refund handling, and tax requirements
              are published.
            </p>
            <Link href="/contact" className="btn-primary mt-6 inline-flex">
              Express interest
            </Link>
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold">Required disclosure</h2>
            <p className="mt-3 text-sm text-ink/70">
              All affiliates must clearly disclose their relationship with Soul Care
              wherever they promote it. Example disclosure:
            </p>
            <blockquote className="mt-3 rounded-lg bg-parchment p-4 text-sm italic text-ink/65">
              "I may receive a commission if you join Soul Care through my link."
            </blockquote>
            <p className="mt-3 text-xs text-ink/50">
              FTC guidelines require clear, conspicuous disclosure of any material
              affiliate relationship.
            </p>
          </div>
        </div>

        <div className="mt-8 card">
          <h2 className="font-display text-xl font-semibold">What affiliates may not do</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {prohibited.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-ink/70">
                <span className="mt-0.5 text-clay">✗</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-xs text-ink/50">
          Full affiliate program policy and agreement will be published before the
          dashboard and payouts go live.
        </p>
      </Section>
    </>
  );
}
