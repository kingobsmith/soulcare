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

const steps = [
  { num: "1", title: "Apply", body: "Create your account and complete the affiliate application in minutes." },
  { num: "2", title: "Review", body: "Our team reviews your application before any referral link is activated." },
  { num: "3", title: "Share", body: "Once approved, use your unique referral link with required disclosure." },
  { num: "4", title: "Track", body: "Monitor sign-ups and qualifying memberships from your dashboard." },
];

export default function AffiliatesPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Affiliate Partner Program</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Partner with Soul Care.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Help people discover Soul Care. Apply in minutes, receive your unique referral link after
          approval, and earn commissions on qualifying paid memberships.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/affiliates/join" className="btn-gold">
            Become an Affiliate
          </Link>
          <Link
            href="/login?next=/affiliate/dashboard"
            className="btn-secondary border-parchment/30 text-parchment hover:bg-parchment hover:text-ink"
          >
            Affiliate Log In
          </Link>
        </div>
        <p className="mt-6 max-w-xl text-sm text-parchment/60">
          Approval is required before referral links and commissions are activated.
        </p>
      </Section>

      <Section tone="parchment">
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.num} className="card">
              <span className="font-display text-3xl text-brass">{s.num}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="card">
            <h2 className="font-display text-xl font-semibold">Required disclosure</h2>
            <p className="mt-3 text-sm text-ink/70">
              All affiliates must clearly disclose their relationship with Soul Care wherever they
              promote it. Example disclosure:
            </p>
            <blockquote className="mt-3 rounded-lg bg-parchment p-4 text-sm italic text-ink/65">
              &ldquo;I may receive a commission if you join Soul Care through my link.&rdquo;
            </blockquote>
            <Link href="/affiliate/terms" className="mt-4 inline-block text-sm font-semibold text-teal underline underline-offset-2">
              Read Affiliate Terms →
            </Link>
          </div>

          <div className="card">
            <h2 className="font-display text-xl font-semibold">What affiliates may not do</h2>
            <ul className="mt-4 space-y-2">
              {prohibited.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-ink/70">
                  <span className="mt-0.5 text-clay">✗</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
