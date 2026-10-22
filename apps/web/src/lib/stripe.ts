import "server-only";
import Stripe from "stripe";
import { required } from "@/lib/env";

let client: Stripe | undefined;

/** The Stripe client; test keys while building, live keys at launch. */
export function stripe() {
  client ??= new Stripe(required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY));
  return client;
}

/** Statuses that unlock Pro. past_due keeps access while Stripe retries the card. */
export const ACTIVE = new Set(["active", "trialing", "past_due"]);
