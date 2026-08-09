import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { angelReply } from "@/lib/angel";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data, error } = await supabase
    .from("companion_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "Could not load messages." }, { status: 500 });

  return NextResponse.json({ messages: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const content = String(body.content || "").trim().slice(0, 2000);
  if (!content) return NextResponse.json({ error: "Message required." }, { status: 400 });

  const { error: userError } = await supabase.from("companion_messages").insert({
    user_id: user.id,
    role: "user",
    content,
  });

  if (userError) return NextResponse.json({ error: "Could not save message." }, { status: 500 });

  const reply = angelReply(content);

  const { error: angelError } = await supabase.from("companion_messages").insert({
    user_id: user.id,
    role: "angel",
    content: reply,
  });

  if (angelError) return NextResponse.json({ error: "Could not save reply." }, { status: 500 });

  return NextResponse.json({ reply });
}
