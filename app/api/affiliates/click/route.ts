import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const referralCode = String(code || "").trim();
  if (!referralCode) return NextResponse.json({ ok: true });

  const db = createServiceClient();
  const { data: affiliate } = await db
    .from("affiliates")
    .select("id")
    .eq("referral_code", referralCode)
    .eq("status", "approved")
    .maybeSingle();

  if (!affiliate) return NextResponse.json({ ok: true });

  await db.from("affiliate_clicks").insert({
    affiliate_id: affiliate.id,
    referral_code: referralCode,
  });

  return NextResponse.json({ ok: true });
}
