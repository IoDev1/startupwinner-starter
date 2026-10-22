# My App ToDo

The plan from idea to live on web, iOS and Android. `[x]` done, `[~]` in progress, `[ ]` to do. The `<!-- sw:… -->` comments let the StartUpWinner dashboard track progress; keep them when you edit a line. Add your own items anywhere.

## Now

- [ ] **Problem and target user** written in .startupwinner/project.yaml (`market`) <!-- sw:idea.problem -->
- [ ] **MVP scope:** the five features in README.md <!-- sw:mvp.scope -->
- [ ] **The core flow** works end to end in `apps/web/src/app/app` <!-- sw:mvp.core_flow -->
- [ ] **Supabase project** created and `supabase/migrations` applied (README, "Set up the services" 1–2)
- [ ] **Vercel project** with a preview deploy on every push <!-- sw:mvp.preview_deploy -->

## Validate

- [ ] **3+ competitors** with features and pricing (Market tab → research prompt, or `/startupwinner:research`) <!-- sw:validate.competitors_mapped -->
- [ ] **Why us instead of them**, in one sentence (`market.differentiator`) <!-- sw:validate.differentiator -->
- [ ] **A real demand signal:** waitlist sign-ups, 5 user conversations, pre-sales or search volume <!-- sw:validate.demand_signal -->
- [ ] **Pricing hypothesis** in `market.pricing` and `apps/web/src/lib/site.ts` <!-- sw:validate.pricing -->
- [ ] **Opportunity score** (ticks itself once the competitors are researched) <!-- sw:validate.opportunity_score -->

## Before launch

- [ ] **Custom domain** with HTTPS on Vercel; `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL point to it <!-- sw:prelaunch.domain -->
- [~] **Landing page:** write the promise, features and prices in `apps/web/src/lib/site.ts` <!-- sw:prelaunch.landing -->
- [~] **Payments:** Checkout, portal and webhook are wired; create the product and webhook in Stripe, then switch to live keys <!-- sw:prelaunch.payments -->
- [~] **Emails from your domain:** verify it in Resend (SPF/DKIM), set `RESEND_API_KEY` and `EMAIL_FROM`, and point Supabase's SMTP at Resend <!-- sw:prelaunch.transactional_email -->
- [~] **Analytics:** events are wired; set the PostHog key <!-- sw:prelaunch.analytics -->
- [~] **Error tracking:** Sentry is wired on web and server; set the DSN <!-- sw:prelaunch.error_tracking -->
- [~] **Privacy and terms:** starter pages are in; have them reviewed and remove the starter note <!-- sw:prelaunch.legal -->
- [ ] **Database backups** on (Supabase Pro daily backups, or a scheduled dump) <!-- sw:prelaunch.backups -->

## Web

- [ ] **Production deploy** on the custom domain <!-- sw:web.production -->
- [ ] **Uptime monitor:** add `deploy.web.url` to .startupwinner/project.yaml and StartUpWinner checks it every 5 minutes <!-- sw:web.uptime -->
- [ ] **First real payment** <!-- sw:web.first_payment -->

## Mobile

- [~] **App config:** Expo app with `app.json` and `eas.json` is in; set the name and bundle id, replace the icon and splash <!-- sw:mobile.app_config -->
- [ ] **Store assets:** screenshots per device size, description, keywords, support URL <!-- sw:mobile.store_assets -->
- [ ] **In-app purchases** for anything digital sold in the app (the stores require their billing; RevenueCat recommended) <!-- sw:mobile.iap -->
- [ ] **Apple Developer Program** ($99/yr) <!-- sw:mobile.ios.dev_account -->
- [ ] **App Store Connect record** and bundle ID registered <!-- sw:mobile.ios.app_record -->
- [ ] **App Privacy labels** filled <!-- sw:mobile.ios.privacy_labels -->
- [ ] **TestFlight** build tested by 3+ people <!-- sw:mobile.ios.testflight -->
- [ ] **Submitted for App Review** <!-- sw:mobile.ios.review_submitted -->
- [ ] **Live on the App Store** <!-- sw:mobile.ios.live -->
- [ ] **Google Play Console** ($25 once, identity verification takes days) <!-- sw:mobile.android.dev_account -->
- [ ] **Internal testing** build uploaded <!-- sw:mobile.android.internal_testing -->
- [ ] **Data safety** form filled <!-- sw:mobile.android.data_safety -->
- [ ] **Closed test:** 12+ testers for 14+ days (new personal accounts) <!-- sw:mobile.android.closed_testing -->
- [ ] **Production access** granted <!-- sw:mobile.android.production_access -->
- [ ] **Live on Google Play** <!-- sw:mobile.android.live -->

## Launch

- [ ] **3 launch channels** chosen (Product Hunt, Reddit, X, Hacker News, niche communities, newsletters) <!-- sw:launch.channels -->
- [ ] **Launch assets:** demo video or GIF, launch post <!-- sw:launch.assets -->
- [ ] **Launched** on at least one channel <!-- sw:launch.executed -->
- [ ] **Feedback channel** monitored (email, Discord or in-app) <!-- sw:launch.feedback_loop -->

## Later

- [ ] _Ideas that wait until after launch_

## Done

- [x] **Started from the StartUpWinner starter:** Next.js, Supabase, Stripe, Resend, PostHog, Sentry, Expo (README, "What's inside") <!-- sw:mvp.repo_from_template -->
- [x] **.startupwinner/ committed** <!-- sw:idea.manifest -->
- [x] **Sign up, sign in, sign out** with an email code on web and mobile <!-- sw:mvp.auth -->
- [x] **Database with migrations** and row-level security in `supabase/migrations` <!-- sw:mvp.data -->
- [x] **Account deletion** on the Account page and in the app, cancelling Stripe first <!-- sw:prelaunch.account_deletion -->
