import Section from "@/components/Section";
import CrisisNote from "@/components/CrisisNote";

const resources = [
  { title: "Understanding therapy for the first time", body: "What to expect from your first session, in plain language." },
  { title: "Faith and mental health", body: "How faith and clinical care can work together, without either being asked to replace the other." },
  { title: "Supporting a loved one", body: "Practical, non-clinical ways to walk alongside someone who is struggling." },
  { title: "Grief and loss", body: "Gentle guidance for the early, disorienting weeks after a loss." },
  { title: "Anxiety basics", body: "Grounding techniques you can use today, and how to know it's time to talk to someone." },
  { title: "Finding a provider who fits", body: "Questions worth asking before your first appointment." }
];

export default function ResourcesPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">Resources</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Care resources, held gently.
        </h1>
        <p className="mt-4 max-w-2xl text-parchment/75">
          General and faith-sensitive reading to help you understand your options — never a
          substitute for a licensed provider.
        </p>
      </Section>
      <Section tone="parchment">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <div key={r.title} className="card">
              <h3 className="font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{r.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <CrisisNote />
        </div>
      </Section>
    </>
  );
}
