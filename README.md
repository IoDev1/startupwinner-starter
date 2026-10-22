# My App

The one sentence that says what people get.

## MVP scope

At most five features. Anything else waits until after launch.

1. Sign in with an email code (web and mobile)
2. The core flow: _what people come for_
3. Pro plan through Stripe
4. _…_
5. _…_

## What's inside

Started from the [StartUpWinner](https://start-up-winner.vercel.app) starter, so most of the work between "it works" and "strangers can pay for it" is already wired:

| | Where |
|---|---|
| Web: Next.js on Vercel, landing page with pricing, privacy and terms pages | `apps/web` |
| Mobile: Expo (iOS and Android from one codebase), EAS builds | `apps/mobile` |
| Sign-in with an email code, no passwords (Supabase Auth) | `apps/web/src/app/login`, `apps/mobile/app/sign-in.tsx` |
| Database with migrations and row-level security | `supabase/migrations` |
| Subscriptions: Stripe Checkout, billing portal, webhook for created / updated / cancelled / payment failed | `apps/web/src/lib/billing.ts`, `apps/web/src/app/api/stripe/webhook` |
| Emails through Resend: subscribed, payment failed, plan ended, account deleted | `apps/web/src/lib/email.ts` |
| Account deletion on web and in the app (Apple requires it) | `apps/web/src/app/account`, `apps/web/src/app/api/account/delete` |
| Product analytics (PostHog) on sign-in, checkout, subscription and deletion | `apps/web/src/lib/analytics.ts`, `apps/web/src/instrumentation-client.ts` |
| Error tracking (Sentry) in the browser, the server and the edge | `apps/web/src/instrumentation*.ts` |
| Progress tracked in TODO.md for the StartUpWinner dashboard | `TODO.md`, `.startupwinner/project.yaml` |

Every service switches on when its keys are set, so the app builds and runs before any of them exist.

## Run it

Needs Node 22+ and pnpm.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local     # fill in as you set up each service
pnpm dev                                         # http://localhost:3000
```

The mobile app: [apps/mobile/README.md](apps/mobile/README.md).

## Set up the services

Do them in this order; each one ticks items in TODO.md.

1. **Supabase** (database and sign-in): create a project, run `supabase/migrations/*.sql` in the SQL editor (or `supabase db push` with the CLI), and copy the URL, publishable key and secret key into `.env.local`. Under Authentication → URL Configuration, set the Site URL to your address and add `http://localhost:3000/auth/confirm` and `https://<your domain>/auth/confirm` to the redirect URLs.
2. **Sign-in email**: under Authentication → Emails → Magic Link, put both the link and the code in the email, so it works on the web and in the app:
   ```html
   <p>Your sign-in code is <strong>{{ .Token }}</strong>.</p>
   <p>Or <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">sign in with this link</a>.</p>
   ```
3. **Vercel**: import the repo, set the root directory to `apps/web`, add the variables from `.env.example`. Every push gets a preview deploy.
4. **Domain**: add it in Vercel, then set `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL to it.
5. **Resend**: verify your domain (SPF and DKIM records), create an API key, set `RESEND_API_KEY` and `EMAIL_FROM`. Then point Supabase's SMTP settings (Authentication → Emails → SMTP) at Resend so sign-in emails come from your domain too.
6. **Stripe**: create the Pro product with a recurring price (`STRIPE_PRICE_ID`), add a webhook endpoint `https://<your domain>/api/stripe/webhook` with `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` and `invoice.payment_failed` (`STRIPE_WEBHOOK_SECRET`), turn on the customer portal, and use test keys until launch. Locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
7. **PostHog** and **Sentry**: create projects and set their keys.
8. **Expo / EAS**: [apps/mobile/README.md](apps/mobile/README.md).

Then make it yours: `apps/web/src/lib/site.ts` (name, promise, features, prices), the legal pages (have them reviewed), `apps/mobile/app.json` (name, bundle id), and the MVP scope above.

## Track it

Connect the repo at [StartUpWinner](https://start-up-winner.vercel.app): it reads TODO.md and `.startupwinner/project.yaml` and shows what's left before launch on web, iOS and Android. Fill in `.startupwinner/project.yaml` first (or run `/startupwinner:setup` in Claude Code).
