import { NextRequest, NextResponse } from "next/server";
import { logAudit, requireAdmin } from "@/lib/admin";

const allowed = ["submitted", "under_review", "needs_information", "verified", "rejected", "suspended"];

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { providerId, status } = await req.json();
  if (!providerId || !allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { error } = await auth.db
    .from("provider_profiles")
    .update({ verification_status: status })
    .eq("id", providerId);

  if (error) return NextResponse.json({ error: "Update failed." }, { status: 500 });

  await logAudit(auth.user.id, "provider_status_update", "provider_profiles", providerId, { status });

  return NextResponse.json({ ok: true });
}
