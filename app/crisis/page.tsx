import Section from "@/components/Section";

export default function CrisisPage() {
  return (
    <Section tone="ink">
      <p className="eyebrow text-brass-light">Immediate help</p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        If you or someone else is in danger right now, please reach out immediately.
      </h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-parchment/10 p-6">
          <h2 className="font-display text-xl font-semibold">Emergency</h2>
          <p className="mt-2 text-sm text-parchment/75">
            If there is immediate danger to life, call 911 (U.S.) or your local emergency
            number right away.
          </p>
        </div>
        <div className="rounded-2xl bg-parchment/10 p-6">
          <h2 className="font-display text-xl font-semibold">988 Suicide & Crisis Lifeline</h2>
          <p className="mt-2 text-sm text-parchment/75">
            Call or text 988 anytime, day or night, for confidential support if you are
            having thoughts of suicide or are in emotional distress. (U.S. and Canada.)
          </p>
        </div>
        <div className="rounded-2xl bg-parchment/10 p-6">
          <h2 className="font-display text-xl font-semibold">Crisis Text Line</h2>
          <p className="mt-2 text-sm text-parchment/75">
            Text HOME to 741741 to reach a trained crisis counselor by text, free and
            available 24/7 in the U.S.
          </p>
        </div>
        <div className="rounded-2xl bg-parchment/10 p-6">
          <h2 className="font-display text-xl font-semibold">Outside the U.S.</h2>
          <p className="mt-2 text-sm text-parchment/75">
            Search "crisis helpline" plus your country name, or contact your local
            emergency services number.
          </p>
        </div>
      </div>
      <p className="mt-8 max-w-2xl text-sm text-parchment/60">
        Soul Care is a care-navigation platform. It is not a crisis service, and the
        companion is not staffed by a live counselor. If you are in crisis, please use one
        of the resources above rather than waiting for an in-app response.
      </p>
    </Section>
  );
}
