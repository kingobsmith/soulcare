import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function makeCode() {
  return `SC${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let { data: profile } = await supabase
    .from("affiliate_profiles")
    .select("referral_code, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const db = createServiceClient();
    const code = makeCode();
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    await db.from("affiliate_profiles").insert({
      user_id: user.id,
      referral_code: code,
      status: "active",
    });
    if (userProfile?.role === "member") {
      await db.from("profiles").update({ role: "affiliate" }).eq("id", user.id);
    }
    profile = { referral_code: code, status: "active" };
  }

  const { count } = await supabase
    .from("affiliate_attributions")
    .select("*", { count: "exact", head: true })
    .eq("affiliate_id", user.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://soulcares.life";

  return NextResponse.json({
    code: profile.referral_code,
    status: profile.status,
    referrals: count ?? 0,
    link: `${appUrl}/signup?ref=${profile.referral_code}`,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = String(body.code || "").trim();
  const referredUserId = String(body.userId || "").trim();

  if (!code || !referredUserId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = createServiceClient();
  const { data: affiliate } = await db
    .from("affiliate_profiles")
    .select("user_id")
    .eq("referral_code", code)
    .eq("status", "active")
    .maybeSingle();

  if (!affiliate) return NextResponse.json({ ok: true });

  await db.from("affiliate_attributions").insert({
    affiliate_id: affiliate.user_id,
    referred_user_id: referredUserId,
    source: "signup",
  });

  return NextResponse.json({ ok: true });
}
