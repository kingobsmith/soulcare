import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

// Stripe requires the raw request body to verify the signature — do not
// let Next.js parse it as JSON.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const admin = createServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id || null;
        const kind = session.metadata?.kind || "membership";
        const planKey = session.metadata?.planKey || null;

        await admin.from("payments").insert({
          user_id: userId,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          kind,
          amount_cents: session.amount_total,
          currency: session.currency,
          status: session.payment_status
        });

        if (session.mode === "subscription" && session.subscription) {
          await admin.from("subscriptions").upsert(
            {
              user_id: userId,
              stripe_customer_id:
                typeof session.customer === "string" ? session.customer : null,
              stripe_subscription_id:
                typeof session.subscription === "string" ? session.subscription : null,
              plan_key: planKey,
              status: "active"
            },
            { onConflict: "stripe_subscription_id" }
          );
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

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Invoice paid:", invoice.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await admin
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription as string);
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

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        console.log("Connect account updated:", account.id, account.charges_enabled);
        break;
      }

      case "transfer.created": {
        const transfer = event.data.object as Stripe.Transfer;
        console.log("Transfer created:", transfer.id);
        break;
      }

      case "payout.paid":
      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout;
        console.log(`Payout ${event.type}:`, payout.id);
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Error handling Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }
}
