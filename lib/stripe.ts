import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
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
  listen_guidance: {
    priceEnv: "STRIPE_PRICE_LISTEN_GUIDANCE",
    mode: "subscription",
    kind: "membership",
  },
  preferred_care: {
    priceEnv: "STRIPE_PRICE_PREFERRED_CARE",
    mode: "subscription",
    kind: "membership",
  },
  professional_care: {
    priceEnv: "STRIPE_PRICE_PROVIDER_NETWORK",
    mode: "subscription",
    kind: "provider_network",
  },
  professional_growth: {
    priceEnv: "STRIPE_PRICE_PREFERRED_PROVIDER",
    mode: "subscription",
    kind: "provider_network",
  },
};

export function resolvePriceId(planKey: string): string | undefined {
  const plan = PLANS[planKey];
  if (!plan) return undefined;
  return process.env[plan.priceEnv];
}
