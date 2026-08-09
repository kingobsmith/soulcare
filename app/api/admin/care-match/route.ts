import { NextRequest, NextResponse } from "next/server";
import { logAudit, requireAdmin } from "@/lib/admin";

const statuses = ["submitted", "reviewing", "matched", "closed"];

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { requestId, status, providerId } = await req.json();
  if (!requestId || !statuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { error } = await auth.db
    .from("care_match_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) return NextResponse.json({ error: "Update failed." }, { status: 500 });

  if (providerId && status === "matched") {
    await auth.db.from("referrals").insert({
      care_match_request_id: requestId,
      provider_id: providerId,
      status: "offered",
    });
  }

  await logAudit(auth.user.id, "care_match_update", "care_match_requests", requestId, {
    status,
    providerId: providerId || null,
  });

  return NextResponse.json({ ok: true });
}
