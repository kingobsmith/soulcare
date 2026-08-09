import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { planKey } = await req.json();
    const plan = PLANS[planKey];

    if (!plan) {
      return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
    }

    const priceId = process.env[plan.priceEnv];
    if (!priceId) {
      return NextResponse.json(
        { error: `Missing ${plan.priceEnv} environment variable. Add it in Vercel and Stripe.` },
        { status: 500 }
      );
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/membership?checkout=cancelled`,
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: { planKey, kind: plan.kind, userId: user?.id || "" },
      allow_promotion_codes: true
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
