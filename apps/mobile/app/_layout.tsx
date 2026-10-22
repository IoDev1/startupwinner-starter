import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "../lib/auth";
import { useColors } from "../lib/theme";

// Keep the splash screen up until the stored session has been read,
// so signed-in users never see a flash of the sign-in screen.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();
  const c = useColors();

  useEffect(() => {
    if (!loading) SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;

  return (
    <>
      <StatusBar style="auto" />
      {/* Route protection: a guarded group is only reachable while its guard is true.
          When the session changes, expo-router moves the user to the first allowed route. */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.background } }}>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
