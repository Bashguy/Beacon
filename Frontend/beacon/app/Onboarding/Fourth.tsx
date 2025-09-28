import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Fifth() {
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

      {/* First Card */}
      <View style={styles.cardDark}>
        <Text style={styles.cardTitle}>Are you okay?</Text>
        <TouchableOpacity style={styles.lightButton}>
          <Text style={styles.lightButtonText}>Yes, all good.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lightButton}>
          <Text style={styles.lightButtonText}>No, send a beacon.</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.body}>
        Every few minutes, the{"\n"}app will check in on you.
      </Text>

      {/* Second Card */}
      <View style={styles.cardLight}>
        <Text style={styles.cardTitleDark}>Send to who?</Text>
        <TouchableOpacity style={styles.lightButton}>
          <Text style={styles.lightButtonTextDark}>Emergency Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.lightButton}>
          <Text style={styles.lightButtonTextDark}>SOS - Police</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.darkButton}>
          <Text style={styles.darkButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.body}>
        If you’re feeling unsafe,{"\n"}send a beacon.
      </Text>

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/Onboarding/Fifth")}
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
    marginVertical: 16,
  },
  dot: {
    color: "#fff",
    fontSize: 25,
  },
  cardDark: {
    backgroundColor: "#2C3223",
    borderRadius: 10,
    padding: 16,
    width: "90%",
    marginBottom: 16,
    alignItems: "center",
  },
  cardLight: {
    backgroundColor: "#F5F1E9",
    borderRadius: 10,
    padding: 16,
    width: "90%",
    marginBottom: 16,
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  cardTitleDark: {
    color: "#2C3223",
    fontSize: 16,
    marginBottom: 12,
  },
  lightButton: {
    backgroundColor: "#F5F1E9",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  lightButtonText: {
    color: "#2C3223",
    fontSize: 15,
  },
  lightButtonTextDark: {
    color: "#2C3223",
    fontSize: 15,
  },
  darkButton: {
    backgroundColor: "#2C3223",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  darkButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  body: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
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
