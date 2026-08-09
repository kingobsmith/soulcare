import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import CareMatchForm from "@/components/CareMatchForm";

export default async function CareMatchPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Section tone="parchment">
        <div className="max-w-xl">
          <p className="eyebrow">Soul Care</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Sign up now</h1>
          <p className="mt-4 text-ink/70">
            Create your free Soul Care account to meet Angel, access daily support, and connect with
            your care team. Sign up takes less than a minute.
          </p>
          <div className="mt-4 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-xs text-ink/75">
            <strong>Crisis notice:</strong> If you are in immediate danger, call 911 or{" "}
            <strong>988</strong>.{" "}
            <Link href="/crisis" className="font-semibold underline underline-offset-2">
              Crisis resources →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary">
              Sign up now — it&apos;s free
            </Link>
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink/55">
            Already a member? Log in to request a provider match from your dashboard.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="parchment">
      <div className="max-w-xl">
        <p className="eyebrow">Provider match</p>
        <h1 className="mt-2 font-display text-3xl font-semibold">Request a provider match</h1>

        <div className="mt-4 rounded-xl border border-clay/30 bg-clay/10 px-4 py-3 text-xs text-ink/75">
          <strong>Crisis notice:</strong> If you are in immediate danger, call 911 or text/call{" "}
          <strong>988</strong>. This form is not an emergency or clinical intake channel.{" "}
          <Link href="/crisis" className="font-semibold underline underline-offset-2">
            Crisis resources →
          </Link>
        </div>

        <p className="mt-4 text-sm text-ink/60">
          Please do not include private medical information, diagnoses, therapy notes, or crisis
          details in this form.
        </p>

        <CareMatchForm />
      </div>
    </Section>
  );
}
