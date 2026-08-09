import Link from "next/link";
import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";
import PricingCard from "@/components/PricingCard";

const howItWorks = [
  {
    num: "01",
    title: "Sign up free",
    body: "Create your Soul Care account in minutes. Meet Angel for daily listening and spiritual guidance."
  },
  {
    num: "02",
    title: "Get matched to a real provider",
    body: "Soul Care routes your request to vetted, licensed professionals matched on specialty, language, and faith preference."
  },
  {
    num: "03",
    title: "Book with confidence",
    body: "Choose a provider and book a session. Every provider is manually verified before appearing in matching."
  }
];

const cards = [
  { title: "Faith-sensitive preferences", body: "Tell us what matters spiritually — or opt out entirely. Your care should fit your whole self." },
  { title: "Cultural & language matching", body: "Find a provider who understands your background and speaks your language." },
  { title: "Licensed provider pathway", body: "Every clinical provider is manually verified — license, credentials, and insurance — before any member sees their profile." },
  { title: "Private, mobile-first tools", body: "A calm, quiet interface built for the moments you need it most, on any device." }
];

const providerBullets = [
  "Verified professional profile",
  "Specialty, language & faith-preference matching",
  "Availability controls you set anytime",
  "Referral dashboard — accept or decline on your terms",
  "Stripe Connect payouts after completed sessions"
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-parchment">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-24">
          <p className="eyebrow text-brass">Soul Care</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-balance sm:text-6xl">
            A liaison between you and your care team.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-parchment/75">
            Soul Care connects you with Angel for daily listening and sound spiritual guidance —
            and keeps your therapist, doctor, and pastor aligned with progress reports until you see
            a professional.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-gold">
              Sign up now
            </Link>
            <Link
              href="/providers/apply"
              className="btn-secondary border-parchment/30 text-parchment hover:bg-parchment hover:text-ink"
            >
              Join the Provider Network
            </Link>
          </div>
          <div className="mt-8 max-w-xl text-xs text-parchment/55">
            Soul Care is not crisis care or a substitute for professional treatment. If you
            are in immediate danger or thinking about harming yourself or others, call
            emergency services or{" "}
            <strong className="text-parchment/80">988</strong> in the U.S.
          </div>
        </div>
      </section>

      {/* How it works */}
      <Section tone="parchment">
        <p className="eyebrow">How Soul Care works</p>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          {howItWorks.map((s) => (
            <div key={s.num} className="card">
              <span className="font-display text-3xl text-brass">{s.num}</span>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Built for the whole person */}
      <Section tone="white">
        <p className="eyebrow">Built for the whole person</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-ink/10 p-6">
              <h3 className="font-display text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-ink/65">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Companion teaser */}
      <Section tone="parchment">
        <div className="rounded-2xl border border-teal/20 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-xl bg-teal/10 p-3 text-3xl">✨</div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Meet Angel</h2>
              <p className="text-sm text-ink/60">Your daily voice of support</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-ink/70">
            Angel listens daily, offers sound spiritual guidance, and acts as a bridge to your
            therapist, doctor, and pastor — with progress reports when you&apos;re ready.
          </p>
          <Link href="/signup" className="btn-primary mt-5 inline-flex">
            Sign up now — free to start
          </Link>
        </div>
      </Section>

      {/* For providers */}
      <section className="bg-teal-dark text-parchment">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="eyebrow text-brass-light">For licensed providers</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-balance">
                Your work starts before the first session.
              </h2>
              <p className="mt-4 text-parchment/75">
                Soul Care helps members name what they need, then routes qualified
                requests to providers equipped to serve them.
              </p>
              <Link href="/providers/apply" className="btn-gold mt-6 inline-flex">
                Apply in about 6 minutes
              </Link>
            </div>
            <ul className="space-y-3">
              {providerBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl bg-parchment/5 p-4">
                  <span className="text-brass-light">✓</span>
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Section tone="parchment">
        <p className="eyebrow">Pricing</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">
          Start free. Upgrade when it helps.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PricingCard
            name="Companion"
            price="Free"
            description="Create your account, meet Angel, browse resources, and sign up for care."
            features={[
              "Free member account",
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
            description="Angel plus care team progress reports. 7-day free trial — cancel anytime."
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
            description="One booked session with a verified, licensed provider."
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
        <p className="mt-5 text-sm text-ink/60">
          Licensed providers?{" "}
          <Link href="/providers" className="font-semibold text-teal underline underline-offset-2">
            See provider network pricing →
          </Link>
        </p>
      </Section>

      {/* Mission + crisis note */}
      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Care that honors the whole story.
            </h2>
            <p className="mt-4 text-ink/70">
              Soul Care was built to remove the first, hardest step toward getting
              help — admitting you need it. We hold that moment with care, then
              connect you to licensed professionals equipped to walk the rest of the
              way with you.
            </p>
          </div>
          <CrisisNote />
        </div>
      </Section>
    </>
  );
}
