import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20"
});

// Maps the plan keys used in the UI to Stripe Price IDs and the checkout mode.
// Create these Prices in the Stripe Dashboard first — see README "Stripe Setup Guide".
export const PLANS: Record<
  string,
  {
    priceEnv: string;
    mode: "subscription" | "payment";
    kind: "membership" | "session" | "provider_network";
    trialDays?: number;
  }
> = {
  companion_plus: {
    priceEnv: "STRIPE_PRICE_COMPANION_PLUS",
    mode: "subscription",
    kind: "membership",
    trialDays: 7,
  },
  therapy_session: {
    priceEnv: "STRIPE_PRICE_THERAPY_SESSION",
    mode: "payment",
    kind: "session"
  },
  provider_network: {
    priceEnv: "STRIPE_PRICE_PROVIDER_NETWORK",
    mode: "subscription",
    kind: "provider_network"
  }
};
