import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" updated="YYYY-MM-DD">
      <p>
        This policy explains what {site.company} (&quot;we&quot;) collects when you use {site.name}, why, and what
        you can do about it.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address, to sign you in and to send you emails about your account.</li>
        <li>What you create in {site.name}, to provide the service.</li>
        <li>Billing details, handled by Stripe; we never see or store your full card number.</li>
        <li>Usage events (pages and actions) to improve the product, through PostHog.</li>
        <li>Error reports, through Sentry, to fix problems.</li>
      </ul>
      <h2>Who processes it</h2>
      <p>
        Supabase (database and sign-in), Vercel (hosting), Stripe (payments), Resend (email), PostHog (analytics) and
        Sentry (errors). We don&apos;t sell your data.
      </p>
      <h2>How long we keep it</h2>
      <p>
        As long as you have an account. Delete your account from the Account page (on the web or in the app) and
        your data is deleted; billing records Stripe must keep by law stay with Stripe.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask for a copy of your data, correct it or delete it: write to{" "}
        <a className="underline" href={`mailto:${site.contactEmail}`}>
          {site.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
