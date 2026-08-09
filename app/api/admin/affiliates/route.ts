import { NextRequest, NextResponse } from "next/server";
import { logAudit, requireAdmin } from "@/lib/admin";
import { makeReferralCode, referralUrl } from "@/lib/affiliate";

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { affiliateId, status } = await req.json();
  const allowed = ["approved", "rejected", "suspended", "pending"];

  if (!affiliateId || !allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "approved") {
    const { data: current } = await auth.db
      .from("affiliates")
      .select("referral_code")
      .eq("id", affiliateId)
      .maybeSingle();

    let code = current?.referral_code;
    if (!code) {
      code = makeReferralCode();
      update.referral_code = code;
      update.referral_url = referralUrl(code);
    }
    update.approved_at = new Date().toISOString();
    update.rejected_at = null;
  }

  if (status === "rejected") {
    update.rejected_at = new Date().toISOString();
  }

  const { error } = await auth.db.from("affiliates").update(update).eq("id", affiliateId);

  if (error) return NextResponse.json({ error: "Update failed." }, { status: 500 });

  await logAudit(auth.user.id, "affiliate_status_update", "affiliates", affiliateId, { status });

  return NextResponse.json({ ok: true });
}
