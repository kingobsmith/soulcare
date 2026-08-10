import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20"
});

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
  preferred_care: {
    priceEnv: "STRIPE_PRICE_PREFERRED_CARE",
    mode: "subscription",
    kind: "membership",
  },
  therapy_session: {
    priceEnv: "STRIPE_PRICE_THERAPY_SESSION",
    mode: "payment",
    kind: "session",
  },
  provider_network: {
    priceEnv: "STRIPE_PRICE_PROVIDER_NETWORK",
    mode: "subscription",
    kind: "provider_network",
  },
  preferred_provider: {
    priceEnv: "STRIPE_PRICE_PREFERRED_PROVIDER",
    mode: "subscription",
    kind: "provider_network",
  },
};
