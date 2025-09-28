import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function First() {
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
      <Text style={styles.title}>
        <Text style={{ fontStyle: "italic" }}>Peace of mind,{"\n"}</Text>
        <Text style={{ fontStyle: "italic" }}>every step of the way.</Text>
      </Text>

      {/* Decorative line */}
      <View style={styles.decorLine}>
        <Text style={styles.dot}>⋄⋄⋄</Text>
      </View>

      {/* Body */}
      <Text style={styles.body}>
        <Text style={styles.bold}>Project Beacon</Text> keeps you connected and
        protected on every journey.{" "}
        <Text style={styles.bold}>Share your destination</Text> and ETA with
        trusted contacts, receive gentle <Text style={styles.bold}>check-ins</Text> along the way, and automatically{" "}
        <Text style={styles.bold}>notify</Text> loved ones when you arrive
        safely.{"\n\n"}
        Designed for <Text style={styles.bold}>pedestrians</Text> and{" "}
        <Text style={styles.bold}>wheelchair users</Text>, Beacon highlights
        safer routes and marks areas with <Text style={styles.bold}>higher accident</Text> or{" "}
        <Text style={styles.bold}>crime rates</Text>.{"\n\n"}
        <Text style={styles.bold}>Low battery?</Text> Contacts are alerted
        automatically.
      </Text>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/Onboarding/Second")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C6648", // match green tone
    padding: 20,
    justifyContent: "flex-start",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    color: "#fff",
    marginTop: 50,
    marginBottom: 15,
    fontStyle: "italic",
    top: 30,
  },
  decorLine: {
    alignItems: "center",
    marginBottom: 20,
    top: 30,
  },
  dot: {
    color: "#fff",
    fontSize: 25,
  },
  body: {
    fontSize: 21,
    color: "#fff",
    lineHeight: 28,
    top: 40,
    textAlign: "center",
  },
  bold: {
    fontWeight: "600",
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
