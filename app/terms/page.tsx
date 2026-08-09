import Section from "@/components/Section";

export default function TermsPage() {
  return (
    <Section tone="parchment">
      <div className="max-w-2xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-1 text-xs text-ink/50">Effective date: August 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-ink/75">

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Acceptance</h2>
            <p className="mt-2">
              By using Soul Care, you agree to these Terms and the Privacy Notice. If you
              do not agree, do not use the platform.
            </p>
          </div>

          <div className="rounded-xl border border-clay/30 bg-clay/10 p-4 text-ink/80">
            <p className="font-semibold">Not emergency or clinical care</p>
            <p className="mt-1">
              Soul Care is not an emergency service, crisis line, hospital, or substitute
              for professional diagnosis, treatment, or medical advice. If you are in
              immediate danger or think you may harm yourself or another person, call
              emergency services immediately. In the United States, call or text 988 for
              the Suicide &amp; Crisis Lifeline.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">AI and Care Navigation</h2>
            <p className="mt-2">
              Any AI-enabled feature is intended to provide general support, reflection,
              education, and care-navigation assistance. It does not diagnose conditions,
              prescribe treatment, provide psychotherapy, establish a clinician-patient
              relationship, or replace a licensed professional. Do not rely on
              AI-generated content for emergency, medical, legal, or mental-health
              decisions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Provider Network</h2>
            <p className="mt-2">
              Providers who apply to or participate in the Soul Care Provider Network
              must provide accurate information and maintain all required licenses,
              insurance, and credentials. Acceptance into the Provider Network is not
              guaranteed. Soul Care may review, approve, suspend, or remove provider
              participation at its discretion, subject to applicable law and separate
              provider agreements.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Member Accounts</h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account
              credentials and for activity that occurs through your account. Notify Soul
              Care promptly if you suspect unauthorized use.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Payments and Subscriptions</h2>
            <p className="mt-2">
              Certain features require payment. Prices, billing periods, cancellation
              terms, refund terms, and eligibility requirements are displayed at checkout
              or in the applicable plan terms. Payments are processed by Stripe. By
              completing a purchase, you authorize Stripe to charge the payment method
              you provide.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Acceptable Use</h2>
            <p className="mt-2">You may not use Soul Care to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Break the law or violate another person's rights</li>
              <li>Submit false provider credentials or impersonate another person</li>
              <li>Upload malicious code or attempt to compromise platform security</li>
              <li>Harass, threaten, exploit, or harm others</li>
              <li>Use the platform to send emergency or crisis requests through non-emergency channels</li>
              <li>Copy, resell, scrape, or misuse platform content or data without authorization</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Intellectual Property</h2>
            <p className="mt-2">
              Soul Care branding, content, software, designs, and materials are owned by
              or licensed to Soul Care and may not be used without written permission.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Disclaimers</h2>
            <p className="mt-2">
              Soul Care is provided on an "as is" and "as available" basis except where
              law requires otherwise. Soul Care does not guarantee provider availability,
              a specific match, clinical outcomes, uninterrupted service, or that any
              information on the platform will be complete or error-free.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, Soul Care and its affiliates will
              not be liable for indirect, incidental, special, consequential, or punitive
              damages arising from use of the platform.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Changes and Termination</h2>
            <p className="mt-2">
              Soul Care may modify, suspend, or discontinue features and may update these
              Terms. Continued use after updated Terms take effect means you accept the
              revised Terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              Questions about these Terms:{" "}
              <a href="mailto:legal@soulcares.co" className="font-medium text-teal underline underline-offset-2">
                legal@soulcares.co
              </a>
            </p>
            <p className="mt-2 text-xs text-ink/50">
              This is interim copy. Have an attorney tailor governing law, arbitration,
              refund policy, provider agreement, and HIPAA language before any PHI launch.
            </p>
          </div>

        </div>
      </div>
    </Section>
  );
}
