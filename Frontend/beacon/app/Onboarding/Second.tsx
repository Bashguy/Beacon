import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type OnboardingItemProps = {
  iconName: keyof typeof MaterialIcons.glyphMap;
  text: string;
};

const OnboardingItem = ({ iconName, text }: OnboardingItemProps) => (
  <View style={styles.itemContainer}>
    <View style={styles.iconCircle}>
      <MaterialIcons name={iconName} size={45} color="#fff" />
    </View>
    <Text style={styles.itemText}>{text}</Text>
  </View>
);

export default function Second() {
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


      {/* Decorative line */}
      <View style={styles.decorLine}>
        <Text style={styles.dot}>⋄⋄⋄</Text>
      </View>


      {/* Steps */}
      <OnboardingItem
        iconName="home"
        text="Mark locations where you feel secure."
      />
      <OnboardingItem
        iconName="person"
        text="Add your trusted contacts you want notified."
      />

      {/* Next Button */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/Onboarding/Third")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5C6648", // same olive green background
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
    marginBottom: 40,
    top: 20,
  },
  decorLine: {
    alignItems: "center",
    marginVertical: 0,
    marginBottom: -20,
  },
  dot: {
    color: "#fff",
    fontSize: 25,
  },
  itemContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#2C3223",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    top: 50,
  },
  itemText: {
    color: "#fff",
    fontSize: 21,
    textAlign: "center",
    lineHeight: 25,
    top: 48,
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
