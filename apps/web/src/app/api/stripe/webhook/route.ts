import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { track } from "@/lib/analytics";
import { saveSubscription } from "@/lib/billing";
import { emails, sendEmail } from "@/lib/email";
import { required } from "@/lib/env";
import { stripe } from "@/lib/stripe";

// Stripe → Developers → Webhooks → add https://<your site>/api/stripe/webhook with these events.
const EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

export async function POST(request: NextRequest) {
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") ?? "",
      required("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),
    );
  } catch (error) {
    console.error("stripe webhook: bad signature", error);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  if (!EVENTS.has(event.type)) return NextResponse.json({ ignored: event.type });

  try {
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer_email) {
        const { subject, text } = emails.paymentFailed();
        await sendEmail(invoice.customer_email, subject, text);
      }
      return NextResponse.json({ ok: true });
    }

    const sub = event.data.object as Stripe.Subscription;
    const userId = await saveSubscription(sub);
    if (!userId) return NextResponse.json({ ignored: "deleted account" });
    const customer = await stripe().customers.retrieve(typeof sub.customer === "string" ? sub.customer : sub.customer.id);
    const email = "email" in customer ? customer.email : null;

    if (event.type === "customer.subscription.created") {
      await track(userId, "subscription_started", { price: sub.items.data[0]?.price.id });
      if (email) await sendEmail(email, emails.subscribed().subject, emails.subscribed().text);
    } else if (event.type === "customer.subscription.deleted") {
      await track(userId, "subscription_ended");
      if (email) await sendEmail(email, emails.cancelled().subject, emails.cancelled().text);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    // A 500 makes Stripe retry, so a database hiccup doesn't lose a subscription.
    console.error(`stripe webhook ${event.type} failed:`, error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
