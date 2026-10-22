"use server";

import { redirect } from "next/navigation";
import { track } from "@/lib/analytics";
import { currentUser } from "@/lib/auth";
import { customerFor, deleteAccount } from "@/lib/billing";
import { emails, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site";
import { required } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

async function signedIn() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/account");
  return user;
}

/** Sends the person to Stripe Checkout for Pro; the webhook records the subscription. */
export async function startCheckout() {
  const user = await signedIn();
  const customer = await customerFor(user.id, user.email);
  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: required("STRIPE_PRICE_ID", process.env.STRIPE_PRICE_ID), quantity: 1 }],
    client_reference_id: user.id,
    success_url: `${siteUrl()}/app?checkout=success`,
    cancel_url: `${siteUrl()}/account`,
    allow_promotion_codes: true,
  });
  await track(user.id, "checkout_started");
  redirect(session.url!);
}

/** Stripe's billing portal: change card, see invoices, cancel. */
export async function openPortal() {
  const user = await signedIn();
  const customer = await customerFor(user.id, user.email);
  const portal = await stripe().billingPortal.sessions.create({ customer, return_url: `${siteUrl()}/account` });
  redirect(portal.url);
}

/** Deletes the account and everything in it, after the person typed DELETE. */
export async function deleteMyAccount(form: FormData) {
  const user = await signedIn();
  if (form.get("confirm") !== "DELETE") redirect("/account?delete=confirm");
  await deleteAccount(user.id);
  await track(user.id, "account_deleted");
  if (user.email) {
    const { subject, text } = emails.accountDeleted();
    await sendEmail(user.email, subject, text);
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
