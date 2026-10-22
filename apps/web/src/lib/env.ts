// NEXT_PUBLIC_ variables must be read by their full name so Next inlines them in the browser.

export function required(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing environment variable ${name} (see .env.example)`);
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
  },
  get supabasePublishableKey() {
    return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  },
};
