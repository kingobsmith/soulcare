import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { buildProgressSummary } from "@/lib/angel";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ error: "Email not configured." }, { status: 502 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [{ data: messages }, { data: team }, { data: profile }] = await Promise.all([
    supabase
      .from("companion_messages")
      .select("role, content, created_at")
      .eq("user_id", user.id)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("care_team_members").select("role, name, email").eq("user_id", user.id),
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
  ]);

  if (!team?.length) {
    return NextResponse.json({ error: "Add your care team first." }, { status: 400 });
  }

  const summary = buildProgressSummary(profile?.full_name || user.email || "Member", messages ?? []);
  const resend = new Resend(apiKey);
  const recipients = team.map((t) => t.email);

  const { error } = await resend.emails.send({
    from,
    to: recipients,
    subject: `Soul Care — Angel progress report for ${profile?.full_name || "member"}`,
    text: summary,
  });

  if (error) return NextResponse.json({ error: "Could not send report." }, { status: 502 });

  const db = createServiceClient();
  await db.from("progress_reports").insert({
    user_id: user.id,
    summary,
    recipients: team,
  });

  return NextResponse.json({ ok: true, sentTo: recipients.length });
}
