import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("care_team_members")
    .select("id, role, name, email")
    .eq("user_id", user.id)
    .order("role");

  return NextResponse.json({ members: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const members = Array.isArray(body.members) ? body.members : [];

  for (const m of members) {
    const role = String(m.role || "");
    const name = String(m.name || "").trim().slice(0, 120);
    const email = String(m.email || "").trim().slice(0, 160);

    if (!["therapist", "doctor", "pastor"].includes(role) || !name || !email) continue;

    await supabase.from("care_team_members").upsert(
      { user_id: user.id, role, name, email },
      { onConflict: "user_id,role" }
    );
  }

  const { data } = await supabase
    .from("care_team_members")
    .select("id, role, name, email")
    .eq("user_id", user.id);

  return NextResponse.json({ members: data ?? [] });
}
