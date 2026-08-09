import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// Creates (or resumes) a Stripe Connect Express account for a verified
// provider so they can receive session payouts, then returns an onboarding link.
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const admin = createServiceClient();
  const { data: provider } = await admin
    .from("provider_profiles")
    .select("id, stripe_connect_account_id, verification_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!provider) {
    return NextResponse.json({ error: "Provider profile not found." }, { status: 404 });
  }

  if (provider.verification_status !== "verified") {
    return NextResponse.json(
      { error: "Your application must be verified before payout onboarding." },
      { status: 403 }
    );
  }

  let accountId = provider.stripe_connect_account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email || undefined,
      capabilities: {
        transfers: { requested: true }
      }
    });
    accountId = account.id;

    await admin
      .from("provider_profiles")
      .update({ stripe_connect_account_id: accountId })
      .eq("id", provider.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${appUrl}/provider/dashboard?connect=refresh`,
    return_url: `${appUrl}/provider/dashboard?connect=complete`,
    type: "account_onboarding"
  });

  return NextResponse.json({ url: accountLink.url });
}
