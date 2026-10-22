import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import { AppState } from "react-native";

import { env } from "./env";

// Session storage: AsyncStorage rather than expo-secure-store.
// SecureStore warns or fails on values over 2048 bytes and a Supabase session
// (access + refresh token + user JSON) often exceeds that, so it would need a
// chunking or encrypt-and-split wrapper. AsyncStorage has no size limit, needs
// no extra code, and the data lives in the app's private sandbox. If your app
// needs encryption at rest, swap in a SecureStore-backed adapter here.
export const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Refresh tokens only while the app is in the foreground (Supabase's Expo guide).
// When the app comes back, refreshing resumes and an expired session is renewed;
// in the background no timers run, so nothing is wasted or killed mid-request.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
