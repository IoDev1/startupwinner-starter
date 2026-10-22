// Expo inlines EXPO_PUBLIC_* variables at build time, but only when they are
// read as literal `process.env.EXPO_PUBLIC_...` expressions, so keep them spelled out.
const values = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_WEB_URL: process.env.EXPO_PUBLIC_WEB_URL,
};

const missing = Object.entries(values)
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(
    `Missing environment variables: ${missing.join(", ")}. ` +
      "Copy apps/mobile/.env.example to apps/mobile/.env, fill it in, " +
      "then restart Expo with `npx expo start --clear`. " +
      "For EAS builds, set them with `eas env:create` or in eas.json.",
  );
}

export const env = {
  supabaseUrl: values.EXPO_PUBLIC_SUPABASE_URL!,
  supabasePublishableKey: values.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  // No trailing slash, so `${webUrl}/api/...` is always well formed.
  webUrl: values.EXPO_PUBLIC_WEB_URL!.replace(/\/+$/, ""),
};
