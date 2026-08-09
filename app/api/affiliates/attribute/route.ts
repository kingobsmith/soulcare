import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { REF_COOKIE } from "@/lib/affiliate";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const cookieStore = cookies();
  const referralCode = String(body.code || cookieStore.get(REF_COOKIE)?.value || "").trim();

  if (!referralCode) return NextResponse.json({ ok: true });

  const db = createServiceClient();
  const { data: affiliate } = await db
    .from("affiliates")
    .select("user_id")
    .eq("referral_code", referralCode)
    .eq("status", "approved")
    .maybeSingle();

  if (!affiliate || affiliate.user_id === user.id) {
    return NextResponse.json({ ok: true });
  }

  const { data: existing } = await db
    .from("affiliate_attributions")
    .select("id")
    .eq("referred_user_id", user.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true });

  await db.from("affiliate_attributions").insert({
    affiliate_id: affiliate.user_id,
    referred_user_id: user.id,
    referral_code: referralCode,
    source: "signup",
  });

  return NextResponse.json({ ok: true });
}
