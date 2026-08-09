import Link from "next/link";
import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";

const steps = [
  {
    title: "Start with the companion",
    body: "Open a private conversation with the Soul Care AI companion. There's no form to fill out first — just start where you are. The companion listens, reflects, and helps you name what's going on."
  },
  {
    title: "Share your preferences",
    body: "When you're ready for more, the care-match questionnaire asks about faith preference, language, cultural background, specific concerns, location, and availability — never a diagnosis."
  },
  {
    title: "Get matched, not marketed to",
    body: "Soul Care routes your request to licensed providers who fit what you shared. Every provider shown to you has been manually verified — license, credentials, and insurance included."
  },
  {
    title: "Book with confidence",
    body: "Choose a provider, book a session, and pay securely. Your companion history stays private and is never shared with a provider without your say-so."
  }
];

export default function HowItWorksPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">How it works</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl text-balance">
          From a private first word to a licensed provider.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          Soul Care is a pathway, not a diagnosis engine. Here's exactly what happens at
          each step.
        </p>
      </Section>
      <Section tone="parchment">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map((s, i) => (
            <div key={s.title} className="card">
              <span className="font-display text-3xl text-brass">{`0${i + 1}`}</span>
              <h2 className="mt-3 font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <CrisisNote />
        </div>
        <div className="mt-8">
          <Link href="/care-match" className="btn-primary">
            Start with Companion
          </Link>
        </div>
      </Section>
    </>
  );
}
