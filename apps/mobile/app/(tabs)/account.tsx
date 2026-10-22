import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Button";
import { useAuth } from "../../lib/auth";
import { env } from "../../lib/env";
import { supabase } from "../../lib/supabase";
import { useColors } from "../../lib/theme";

export default function Account() {
  const c = useColors();
  const { session } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
  }

  // Apple App Store guideline 5.1.1(v): apps that let people create an account
  // must also let them delete it from inside the app. The web app's
  // /api/account/delete route does the actual deletion with the service key.
  async function deleteAccount() {
    if (!session) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${env.webUrl}/api/account/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.status !== 200) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? body?.message ?? `Could not delete the account (HTTP ${res.status}).`);
      }
      // The user no longer exists on the server; clear the local session only.
      await supabase.auth.signOut({ scope: "local" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the account.");
      setDeleting(false);
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete account?",
      "This permanently deletes your account and its data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteAccount },
      ],
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        <Text style={[styles.label, { color: c.muted }]}>Email</Text>
        <Text style={[styles.value, { color: c.text }]}>{session?.user.email}</Text>
      </View>

      <Button title="Sign out" variant="secondary" onPress={signOut} disabled={deleting} />
      <Button title="Delete account" variant="danger" onPress={confirmDelete} loading={deleting} />

      {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  card: { borderWidth: 1, borderRadius: 10, padding: 16, gap: 4, marginBottom: 12 },
  label: { fontSize: 13 },
  value: { fontSize: 16, fontWeight: "500" },
  error: { marginTop: 4, fontSize: 15 },
});
