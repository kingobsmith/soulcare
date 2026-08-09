import Section from "@/components/Section";

export default function PrivacyPage() {
  return (
    <Section tone="parchment">
      <div className="max-w-2xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Privacy Notice</h1>
        <p className="mt-1 text-xs text-ink/50">Last updated: August 2026</p>

        <div className="mt-8 space-y-7 text-sm leading-relaxed text-ink/75">

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Information We Collect</h2>
            <p className="mt-2">
              Soul Care may collect information you provide directly, including your name,
              email address, phone number, account details, provider-application
              information, payment status, and messages you send through non-clinical
              contact forms.
            </p>
            <p className="mt-2">
              Providers may be asked to submit professional details such as license
              information, specialties, service areas, proof of insurance, professional
              biography, and documents needed for credential review.
            </p>
          </div>

          <div className="rounded-xl border border-clay/30 bg-clay/10 p-4 text-ink/80">
            <p className="font-semibold">Important notice about sensitive information</p>
            <p className="mt-1">
              Do not submit medical records, diagnoses, therapy notes, crisis information,
              payment-card information, or other highly sensitive personal information
              through the general contact form. Soul Care is not an emergency service.
              If you may harm yourself or someone else, call emergency services
              immediately. In the United States, call or text 988 for the Suicide &amp;
              Crisis Lifeline.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">How We Use Information</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Operate and improve the website and services</li>
              <li>Create and manage accounts</li>
              <li>Review provider applications and credentials</li>
              <li>Process purchases and subscriptions</li>
              <li>Respond to questions and support requests</li>
              <li>Protect the platform from fraud, misuse, and security threats</li>
              <li>Comply with legal obligations</li>
              <li>Send service-related messages and, where permitted, marketing communications</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Payments</h2>
            <p className="mt-2">
              Payments are processed by Stripe. Soul Care does not store full
              payment-card numbers on its own servers.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Service Providers</h2>
            <p className="mt-2">
              Soul Care may use carefully selected service providers to help operate the
              platform, such as hosting, authentication, payment, email, security,
              analytics, and customer-support providers. These providers may process
              information only as needed to provide their services.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Provider Information</h2>
            <p className="mt-2">
              Information submitted by provider applicants may be used to review
              credentials, create professional profiles, manage network participation,
              support referral operations, and communicate about the Provider Network.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Your Choices</h2>
            <p className="mt-2">
              You may request access to, correction of, or deletion of eligible personal
              information by contacting{" "}
              <a href="mailto:privacy@soulcares.co" className="font-medium text-teal underline underline-offset-2">
                privacy@soulcares.co
              </a>
              . You may opt out of marketing emails by using the unsubscribe link
              included in those messages.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Data Security</h2>
            <p className="mt-2">
              Soul Care uses reasonable administrative, technical, and organizational
              measures designed to protect information. No online system can guarantee
              absolute security.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Children</h2>
            <p className="mt-2">
              Soul Care is not intended for children under 13 without verified parent or
              guardian involvement. Do not create an account for a child unless Soul Care
              has specifically provided an approved guardian-consent process.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Changes</h2>
            <p className="mt-2">
              Soul Care may update this Privacy Notice from time to time. The current
              version will always be posted on this page with its effective date.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
            <p className="mt-2">
              For privacy questions, contact Soul Care at{" "}
              <a href="mailto:privacy@soulcares.co" className="font-medium text-teal underline underline-offset-2">
                privacy@soulcares.co
              </a>
              .
            </p>
            <p className="mt-2 text-xs text-ink/50">
              This is interim website copy. Have counsel review and replace before any
              PHI launch or expansion into clinical matching.
            </p>
          </div>

        </div>
      </div>
    </Section>
  );
}
