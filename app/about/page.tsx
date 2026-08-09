import Section from "@/components/Section";

export default function AboutPage() {
  return (
    <>
      <Section tone="ink">
        <p className="eyebrow">About</p>
        <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
          Meet Soul Care.
        </h1>
      </Section>
      <Section tone="parchment">
        <div className="max-w-2xl space-y-5 text-ink/75">
          <p>
            Soul Care exists to soften the hardest part of getting help — the first
            step. We built a private listening companion for the moment before someone
            is ready to talk to a person, and a verified referral network for the
            moment they are.
          </p>
          <p>
            Every provider on Soul Care is manually reviewed: license, credentials, and
            malpractice insurance are checked before any member ever sees their profile.
            We don't promise outcomes we can't verify, and we don't imply endorsement by
            any hospital, government body, or religious institution unless it's
            documented and true.
          </p>
          <p>
            Soul Care is a care-navigation platform, not a clinic. We route people to
            licensed professionals — we don't diagnose, prescribe, or replace them.
          </p>
        </div>
      </Section>
    </>
  );
}
