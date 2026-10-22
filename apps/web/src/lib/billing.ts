import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVE, stripe } from "@/lib/stripe";

/** The person's plan, from the subscriptions table the webhook keeps up to date. */
export async function planOf(userId: string) {
  const { data } = await createAdminClient()
    .from("subscriptions")
    .select("status, cancel_at_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const pro = Boolean(data && ACTIVE.has(data.status));
  return { pro, status: data?.status ?? null, cancelling: Boolean(data?.cancel_at_period_end) };
}

/** The person's Stripe customer, created on first checkout. */
export async function customerFor(userId: string, email: string | undefined) {
  const db = createAdminClient();
  const { data } = await db.from("customers").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
  if (data) return data.stripe_customer_id as string;
  const customer = await stripe().customers.create({ email, metadata: { user_id: userId } });
  const { error } = await db.from("customers").insert({ user_id: userId, stripe_customer_id: customer.id });
  if (error) throw new Error(`saving the Stripe customer failed: ${error.message}`);
  return customer.id;
}

/**
 * Writes a subscription as Stripe sends it; safe to repeat (webhooks can arrive twice or
 * out of order). Null when no account has that customer any more (it was deleted).
 */
export async function saveSubscription(sub: Stripe.Subscription) {
  const db = createAdminClient();
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { data: customer } = await db.from("customers").select("user_id").eq("stripe_customer_id", customerId).maybeSingle();
  if (!customer) return null;
  const { error } = await db.from("subscriptions").upsert({
    id: sub.id,
    user_id: customer.user_id,
    status: sub.status,
    price_id: sub.items.data[0]?.price.id ?? null,
    cancel_at_period_end: sub.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`saving the subscription failed: ${error.message}`);
  return customer.user_id as string;
}

/**
 * Deletes everything the person has: the Stripe customer (which cancels their
 * subscriptions at once) and the auth user, whose rows go with it (on delete cascade).
 */
export async function deleteAccount(userId: string) {
  const db = createAdminClient();
  const { data } = await db.from("customers").select("stripe_customer_id").eq("user_id", userId).maybeSingle();
  if (data) {
    try {
      await stripe().customers.del(data.stripe_customer_id);
    } catch (error) {
      // Already deleted in Stripe is fine; anything else stops here so nobody is billed after deleting.
      if ((error as { code?: string }).code !== "resource_missing") throw error;
    }
  }
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) throw new Error(`deleting the user failed: ${error.message}`);
}
