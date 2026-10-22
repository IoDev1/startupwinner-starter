import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../components/Button";
import { supabase } from "../lib/supabase";
import { useColors } from "../lib/theme";

// Email one-time code sign-in. Supabase sends the code using the "Magic Link"
// email template, which must contain {{ .Token }} (see README).
export default function SignIn() {
  const c = useColors();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function sendCode() {
    const address = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(address)) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: address,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setEmail(address);
    setCode("");
    setNotice(`We sent a 6-digit code to ${address}.`);
    setStep("code");
  }

  async function verifyCode() {
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from the email.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setLoading(false);
    // On success the auth listener updates the session and the router
    // switches to the signed-in screens; nothing else to do here.
    if (error) setError(error.message);
  }

  const inputStyle = [
    styles.input,
    { color: c.text, borderColor: c.border, backgroundColor: c.surface },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={[styles.title, { color: c.text }]}>Sign in</Text>

        {step === "email" ? (
          <View style={styles.form}>
            <Text style={[styles.label, { color: c.muted }]}>
              Enter your email and we will send you a sign-in code.
            </Text>
            <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={c.muted}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="send"
              onSubmitEditing={sendCode}
              editable={!loading}
            />
            <Button title="Send code" onPress={sendCode} loading={loading} />
          </View>
        ) : (
          <View style={styles.form}>
            {notice && <Text style={[styles.label, { color: c.muted }]}>{notice}</Text>}
            <TextInput
              style={[inputStyle, styles.code]}
              value={code}
              onChangeText={(text) => setCode(text.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              placeholderTextColor={c.muted}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={verifyCode}
              editable={!loading}
              autoFocus
            />
            <Button title="Sign in" onPress={verifyCode} loading={loading} />
            <Button
              title="Use a different email"
              variant="secondary"
              disabled={loading}
              onPress={() => {
                setStep("email");
                setError(null);
              }}
            />
          </View>
        )}

        {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  form: { gap: 12 },
  label: { fontSize: 15, lineHeight: 21 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  code: { fontSize: 22, letterSpacing: 8, textAlign: "center" },
  error: { marginTop: 16, fontSize: 15 },
});
