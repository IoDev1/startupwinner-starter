import "server-only";
import { Resend } from "resend";
import { site, siteUrl } from "@/lib/site";

// Transactional email through Resend. Sign-in emails come from Supabase Auth: point its
// SMTP settings at Resend so they're sent from your domain too (README, "Email").

/** Sends an email, or logs and skips it when Resend isn't set up yet. Never throws. */
export async function sendEmail(to: string, subject: string, text: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn(`email skipped (RESEND_API_KEY or EMAIL_FROM not set): ${subject}`);
    return;
  }
  const { error } = await new Resend(key).emails.send({ from, to, subject, text });
  if (error) console.error("email failed:", error.message);
}

export const emails = {
  subscribed: () => ({
    subject: `Welcome to ${site.name} Pro`,
    text: `Thanks for subscribing to ${site.name} Pro.\n\nStripe emails your receipts. Manage your plan any time: ${siteUrl()}/account\n\n${site.company}`,
  }),
  paymentFailed: () => ({
    subject: `Your ${site.name} payment didn't go through`,
    text: `We couldn't charge your card for ${site.name} Pro. Stripe will try again over the next days.\n\nUpdate your card: ${siteUrl()}/account\n\n${site.company}`,
  }),
  cancelled: () => ({
    subject: `Your ${site.name} Pro plan has ended`,
    text: `Your ${site.name} Pro plan has ended; your account stays on Free. Come back any time: ${siteUrl()}/account\n\n${site.company}`,
  }),
  accountDeleted: () => ({
    subject: `Your ${site.name} account is deleted`,
    text: `Your ${site.name} account and its data are deleted, and any subscription is cancelled.\n\n${site.company}`,
  }),
};
