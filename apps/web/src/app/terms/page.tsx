import type { Metadata } from "next";
import { LegalPage } from "@/components/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of service" };

export default function Terms() {
  return (
    <LegalPage title="Terms of service" updated="YYYY-MM-DD">
      <p>
        These terms apply when you use {site.name}, provided by {site.company}. By creating an account you agree to
        them.
      </p>
      <h2>Your account</h2>
      <p>Keep access to your email secure; you&apos;re responsible for what happens in your account.</p>
      <h2>Plans and payment</h2>
      <p>
        Pro renews automatically each period until you cancel. Cancel any time from the Account page; you keep Pro
        until the end of the period you paid for. Prices include or exclude taxes as shown at checkout.
      </p>
      <h2>Acceptable use</h2>
      <p>Don&apos;t break the law, attack the service, or use it to harm others. We may suspend accounts that do.</p>
      <h2>Your content</h2>
      <p>What you create stays yours. You give us the rights needed to store and show it to you.</p>
      <h2>Changes and ending</h2>
      <p>
        We&apos;ll tell you by email before important changes. You can delete your account at any time; we may end the
        service with reasonable notice.
      </p>
      <h2>Liability</h2>
      <p>The service is provided as is, to the extent the law allows.</p>
      <h2>Contact</h2>
      <p>
        <a className="underline" href={`mailto:${site.contactEmail}`}>
          {site.contactEmail}
        </a>
      </p>
    </LegalPage>
  );
}
