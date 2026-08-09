import Section from "@/components/Section";

const faqs = [
  {
    q: "Is the companion a therapist?",
    a: "No. The companion is an AI listening tool that helps you name what's going on and get oriented. It does not diagnose, prescribe, or provide clinical treatment."
  },
  {
    q: "Is my information private?",
    a: "Yes. Your companion conversations are private by default and are never shared with a provider without your consent. We collect only what's needed to route your care-match request."
  },
  {
    q: "How are providers verified?",
    a: "Every provider submits license number, license state, credential type, and documentation (CV, malpractice insurance) for manual admin review before their profile goes live."
  },
  {
    q: "How does payment work?",
    a: "Companion Plus and Provider Network are monthly subscriptions billed through Stripe. Therapy sessions are billed individually at the time of booking. You can manage or cancel billing any time from your dashboard."
  },
  {
    q: "What happens in a crisis?",
    a: "If you or someone else may be in danger, Soul Care shows emergency guidance immediately — call 911 or 988 (in the U.S.) rather than waiting on any in-app flow. See our crisis resources page."
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. Subscriptions can be cancelled any time from the Stripe billing portal, accessible from your dashboard."
  }
];

export default function FAQPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Questions, answered plainly.
        </h1>
      </Section>
      <Section tone="parchment">
        <div className="max-w-3xl divide-y divide-ink/10">
          {faqs.map((f) => (
            <div key={f.q} className="py-6">
              <h3 className="font-display text-lg font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-ink/70">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
