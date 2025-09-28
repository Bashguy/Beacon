import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Third() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.replace("../(tabs)/index.tsx")}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>How It Works</Text>

      {/* Decorative Line */}
      <View style={styles.decorLine}>
        <Text style={styles.dot}>⋄⋄⋄</Text>
      </View>

      {/* Demo Form */}
      <View style={styles.card}>
        <TextInput
          placeholder="Starting Location"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Destination"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity style={styles.demoButton}>
          <Text style={styles.demoButtonText}>Begin Journey</Text>
        </TouchableOpacity>
      </View>

      {/* Explanation */}
      <Text style={styles.body}>
        Enter your destination{"\n"}and begin your journey.{"\n\n"}
        Once you begin, your emergency contacts will be sent a text with: your{" "}
        <Text style={styles.bold}>destination</Text>, your{" "}
        <Text style={styles.bold}>ETA</Text>, and the{" "}
        <Text style={styles.bold}>battery percentage</Text> your phone is at.
      </Text>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/Onboarding/Fourth")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C6648",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
    closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    top: 20,
  },
  decorLine: {
    alignItems: "center",
    marginVertical: 20,
  },
  dot: {
    color: "#fff",
    fontSize: 25,
  },
  card: {
    backgroundColor: "#F5F1E9",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    top: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  demoButton: {
    backgroundColor: "#2C3223",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  demoButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  body: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
    lineHeight: 25,
    marginBottom: 20,
    top: 30,
  },
  bold: {
    fontWeight: "700",
  },
  nextButton: {
    backgroundColor: "#2C3223",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    width: "90%",
  },
  nextText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "500",
  },
});
