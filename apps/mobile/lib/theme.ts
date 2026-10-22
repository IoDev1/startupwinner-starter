import { useColorScheme } from "react-native";

const light = {
  background: "#ffffff",
  surface: "#f4f4f5",
  text: "#18181b",
  muted: "#71717a",
  border: "#d4d4d8",
  primary: "#2563eb",
  primaryText: "#ffffff",
  danger: "#dc2626",
};

const dark: typeof light = {
  background: "#09090b",
  surface: "#18181b",
  text: "#fafafa",
  muted: "#a1a1aa",
  border: "#3f3f46",
  primary: "#3b82f6",
  primaryText: "#ffffff",
  danger: "#f87171",
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === "dark" ? dark : light;
}
