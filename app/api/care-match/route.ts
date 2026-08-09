import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Option A — non-clinical interest form only.
// Stores name, email, state, and service preference. 
// No clinical narratives, diagnoses, or sensitive health info.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Only store the four safe, non-clinical fields.
    const payload = {
      name: String(body.name || "").slice(0, 120),
      email: String(body.email || "").slice(0, 160),
      state: String(body.state || "").slice(0, 60),
      servicePreference: String(body.servicePreference || "").slice(0, 80),
    };

    if (!payload.name || !payload.email || !payload.state) {
      return NextResponse.json({ error: "Name, email, and state are required." }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const db = createServiceClient();
    const { error } = await db.from("care_match_requests").insert({
      member_id: user?.id ?? null,
      preference_summary: payload,
      status: "submitted",
    });

    if (error) {
      console.error("care_match insert error:", error);
      return NextResponse.json({ error: "Could not submit your request." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("care-match route error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
