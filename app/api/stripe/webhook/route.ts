import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_KINDS = new Set(["membership", "session", "provider_network"]);

function paymentKind(raw: string | null | undefined) {
  if (raw && VALID_KINDS.has(raw)) return raw;
  return "membership";
}

function asId(value: unknown): string | null {
  if (typeof value === "string" && value.length > 0) return value;
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Webhook missing signature or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  try {
    const admin = createServiceClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId =
          asId(session.metadata?.userId) || asId(session.client_reference_id);
        const kind = paymentKind(session.metadata?.kind);
        const planKey = session.metadata?.planKey || null;

        const { error: payErr } = await admin.from("payments").insert({
          user_id: userId,
          stripe_payment_intent_id: asId(session.payment_intent),
          kind,
          amount_cents: session.amount_total,
          currency: session.currency || "usd",
          status: session.payment_status || "paid",
        });
        if (payErr) console.error("payments insert error:", payErr);

        if (session.mode === "subscription" && session.subscription) {
          const subId = asId(session.subscription);
          if (subId) {
            const { error: subErr } = await admin.from("subscriptions").upsert(
              {
                user_id: userId,
                stripe_customer_id: asId(session.customer),
                stripe_subscription_id: subId,
                plan_key: planKey,
                status: "active",
              },
              { onConflict: "stripe_subscription_id" }
            );
            if (subErr) console.error("subscriptions upsert error:", subErr);
          }
        }

        const affiliateRef = session.metadata?.affiliateRef;
        if (userId && affiliateRef) {
          await admin
            .from("affiliate_attributions")
            .update({ converted_at: new Date().toISOString() })
            .eq("referred_user_id", userId)
            .eq("referral_code", affiliateRef);

          const { data: affiliate } = await admin
            .from("affiliates")
            .select("user_id")
            .eq("referral_code", affiliateRef)
            .eq("status", "approved")
            .maybeSingle();

          if (affiliate) {
            const { data: existing } = await admin
              .from("affiliate_attributions")
              .select("id")
              .eq("referred_user_id", userId)
              .maybeSingle();

            if (!existing) {
              await admin.from("affiliate_attributions").insert({
                affiliate_id: affiliate.user_id,
                referred_user_id: userId,
                referral_code: affiliateRef,
                source: "checkout",
                converted_at: new Date().toISOString(),
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await admin
          .from("subscriptions")
          .update({ status: sub.status })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await admin
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = asId(invoice.subscription);
        if (subId) {
          await admin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await admin
          .from("payments")
          .update({ status: "succeeded" })
          .eq("stripe_payment_intent_id", pi.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await admin
          .from("payments")
          .update({ status: "failed" })
          .eq("stripe_payment_intent_id", pi.id);
        break;
      }

      case "invoice.paid":
      case "account.updated":
      case "transfer.created":
      case "payout.paid":
      case "payout.failed":
        break;

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error handling Stripe webhook:", err);
    return NextResponse.json({ received: true, warning: "handler_error" }, { status: 200 });
  }
}
