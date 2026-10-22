import { Tabs } from "expo-router";

import { useColors } from "../../lib/theme";

export default function TabsLayout() {
  const c = useColors();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.background },
        headerTintColor: c.text,
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: c.background },
        tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        // Text-only tabs keep the template dependency-free; add icons
        // (e.g. @expo/vector-icons or expo-symbols) with tabBarIcon.
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: { fontSize: 15, fontWeight: "600" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
