import * as Sentry from "@sentry/nextjs";

// Error tracking on the server and the edge; switched on by NEXT_PUBLIC_SENTRY_DSN.
export async function register() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({ dsn, tracesSampleRate: 0.1 });
}

export const onRequestError = Sentry.captureRequestError;
