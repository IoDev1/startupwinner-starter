import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

// Runs in the browser before the app starts. Each service switches on when its key is set.

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 });
}

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2025-05-24",
    person_profiles: "identified_only",
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
