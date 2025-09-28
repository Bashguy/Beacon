// Frontend/beacon/app/(tabs)/login.tsx
import { useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Signed in — credential.user has uid, email, etc.
      console.log("Signed in:", credential.user.uid);
      Alert.alert("Welcome back!", `Signed in as ${credential.user.email}`);
      // TODO: navigate to the main screen or update global auth state
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login failed:", error);
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding" })}
    >
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={loading ? "Signing in…" : "Sign In"}
          onPress={handleSignIn}
          disabled={loading}
        />
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#101418",
  },
  form: {
    gap: 16,
    backgroundColor: "#1c2229",
    padding: 24,
    borderRadius: 12,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
