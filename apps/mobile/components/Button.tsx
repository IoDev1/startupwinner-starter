import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

import { useColors } from "../lib/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = "primary", loading, disabled }: Props) {
  const c = useColors();
  const filled = variant === "primary";
  const color = variant === "danger" ? c.danger : filled ? c.primaryText : c.text;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        filled
          ? { backgroundColor: c.primary }
          : { borderColor: variant === "danger" ? c.danger : c.border, borderWidth: 1 },
        (pressed || inactive) && styles.dimmed,
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.text, { color }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 16, fontWeight: "600" },
  dimmed: { opacity: 0.6 },
});
