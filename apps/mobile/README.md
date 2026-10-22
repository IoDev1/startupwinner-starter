# Mobile app (Expo)

Expo SDK 58, TypeScript, expo-router. Sign-in with an email one-time code
through Supabase, a home screen, and an account screen with sign-out and
in-app account deletion.

## Run locally

```sh
cp .env.example .env    # then fill it in
pnpm install            # from the repo root
pnpm --filter @app/mobile start
```

Press `i` for the iOS simulator, `a` for Android, or scan the QR code with
Expo Go. `pnpm --filter @app/mobile typecheck` runs TypeScript.

## Environment

| Variable | What |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (or legacy anon) key |
| `EXPO_PUBLIC_WEB_URL` | Web app URL, used for `POST /api/account/delete` |

`EXPO_PUBLIC_*` values are bundled into the app, so never put secrets here.
The app throws a clear error on startup if one is missing. Restart with
`npx expo start --clear` after editing `.env`. For EAS builds, add the same
variables with `eas env:create` (or an `env` block in `eas.json`).

## Supabase setup

The app uses the same Supabase project as the web app.

- Email codes are sent with the **Magic Link** email template
  (Authentication > Emails). It must include `{{ .Token }}` so the email
  shows the 6-digit code, for example: `Your code is {{ .Token }}`.
- The code length is set under Authentication > Providers > Email
  (the app expects 6 digits).

## Build and submit with EAS

```sh
npm install -g eas-cli
eas login
eas init                                  # links the project, writes the projectId
eas build --profile development --platform ios   # dev client for simulator/device
eas build --profile preview --platform android   # internal test build
eas build --profile production --platform all
eas submit --profile production --platform ios   # App Store Connect / TestFlight
eas submit --profile production --platform android
```

Build numbers are managed remotely (`appVersionSource: remote`) and
incremented on every production build.

## Before release

- `app.json`: change `name`, `slug`, `scheme`, `ios.bundleIdentifier` and
  `android.package` (they cannot change after the first store release).
- Replace the images in `assets/` (icon, Android adaptive icon layers,
  splash icon, favicon) and the splash/adaptive icon background colors.
- Keep account deletion working: Apple requires it for apps with sign-up.
- Set `EXPO_PUBLIC_WEB_URL` to the production web URL.
