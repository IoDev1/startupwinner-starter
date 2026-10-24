# Project rules (StartUpWinner)

- **The product:** see `.startupwinner/project.yaml` (`market`) and README.md. Keep the MVP to the five features in README.md.
- **The stack:** Next.js on Vercel (`apps/web`), Expo (`apps/mobile`), Supabase (`supabase/migrations`), Stripe, Resend, PostHog and Sentry, each switched on by its keys (README, "Set up the services").
- **The checklist:** `.startupwinner/checklist.md` is the StartUpWinner checklist. When you finish something on it, tick it there with the evidence. TODO.md is the owner's own list: don't add StartUpWinner tags to it.
- **Secrets:** never read or commit `.env*` values; `.env.example` lists the names.
