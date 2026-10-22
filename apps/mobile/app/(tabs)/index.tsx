import { StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../lib/auth";
import { useColors } from "../../lib/theme";

export default function Home() {
  const c = useColors();
  const { session } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={[styles.title, { color: c.text }]}>Your app starts here</Text>
      <Text style={[styles.subtitle, { color: c.muted }]}>
        Signed in as {session?.user.email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { fontSize: 16, textAlign: "center" },
});
