import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe, PLANS, resolvePriceId } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { REF_COOKIE } from "@/lib/affiliate";

export async function POST(req: NextRequest) {
  try {
    const { planKey } = await req.json();
    const plan = PLANS[planKey];

    if (!plan) {
      return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
    }

    const priceId = resolvePriceId(planKey);
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe price for ${planKey}. Set ${plan.priceEnv} in Vercel.` },
        { status: 500 }
      );
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const affiliateRef = cookies().get(REF_COOKIE)?.value || "";

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/membership?checkout=cancelled`,
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: {
        planKey,
        kind: plan.kind,
        userId: user?.id || "",
        affiliateRef,
      },
      allow_promotion_codes: true,
      ...(plan.mode === "subscription" && plan.trialDays
        ? { subscription_data: { trial_period_days: plan.trialDays } }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err && typeof err === "object" && "message" in err && typeof err.message === "string"
        ? err.message
        : "Could not start checkout.";
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
