import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: existing } = await supabase
    .from("affiliates")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "You already submitted an affiliate application." }, { status: 400 });
  }

  const body = await req.json();

  if (!body.termsAccepted || !body.promotionRulesAccepted) {
    return NextResponse.json({ error: "You must accept the affiliate terms." }, { status: 400 });
  }

  const payload = {
    user_id: user.id,
    legal_name: String(body.legalName || "").trim().slice(0, 120),
    organization_name: String(body.organizationName || "").trim().slice(0, 160) || null,
    website_or_social_url: String(body.websiteOrSocialUrl || "").trim().slice(0, 300) || null,
    city: String(body.city || "").trim().slice(0, 80),
    state_region: String(body.stateRegion || "").trim().slice(0, 80),
    country: String(body.country || "").trim().slice(0, 80),
    audience_type: String(body.audienceType || "").trim().slice(0, 80),
    audience_size_range: String(body.audienceSizeRange || "").trim().slice(0, 80),
    promotion_plan: String(body.promotionPlan || "").trim().slice(0, 2000),
    status: "pending",
    terms_accepted_at: new Date().toISOString(),
  };

  if (!payload.legal_name || !payload.city || !payload.country || !payload.promotion_plan) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const { error } = await supabase.from("affiliates").insert(payload);

  if (error) {
    console.error("affiliate apply error:", error);
    return NextResponse.json({ error: "Could not submit application." }, { status: 500 });
  }

  const db = createServiceClient();
  const { data: profile } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role === "member") {
    await db.from("profiles").update({ role: "affiliate" }).eq("id", user.id);
  }

  return NextResponse.json({ ok: true });
}
