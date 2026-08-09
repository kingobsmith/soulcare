import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Section from "@/components/Section";
import AffiliateDashboardClient from "@/components/AffiliateDashboardClient";

export default async function AffiliateDashboard() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <Section tone="parchment">
      <p className="eyebrow">Affiliate dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Share Soul Care</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Refer people to Soul Care with your personal link. Sign-ups through your link are tracked
        here.
      </p>
      <AffiliateDashboardClient />
    </Section>
  );
}
