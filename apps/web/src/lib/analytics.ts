import "server-only";
import { PostHog } from "posthog-node";

// Server-side product events (the browser side is in instrumentation-client.ts).
// Key events: signed_in, checkout_started, subscription_started, subscription_ended,
// account_deleted. Add your core flow's events next to them.

/** Records an event, or does nothing when PostHog isn't set up. Never throws. */
export async function track(userId: string, event: string, properties?: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const posthog = new PostHog(key, { host: process.env.NEXT_PUBLIC_POSTHOG_HOST, flushAt: 1, flushInterval: 0 });
  try {
    posthog.capture({ distinctId: userId, event, properties });
    await posthog.shutdown();
  } catch (error) {
    console.error("analytics failed:", error);
  }
}
