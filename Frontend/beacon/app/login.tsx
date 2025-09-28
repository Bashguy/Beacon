import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/beacon-logo3.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Beacon</Text>
      </View>

      {/* Welcome text */}
      <Text style={styles.welcome}>Welcome!</Text>

      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton}
      onPress={() => router.replace("/map")}>
        <Text style={styles.googleText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Continue Button at bottom */}
      <TouchableOpacity style={styles.continueButton}
      onPress={() => router.replace("/map")}>
        <Text style={styles.continueText}>Continue</Text>
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 10,
    top: 30,
    left: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#252D1F",
    top: -30,
  },
  welcome: {
    fontSize: 25,
    fontWeight: "600",
    color: "#252D1F",
    textDecorationLine: "underline",
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#FFFDFA",
    borderColor: "#1E1E1E",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    top: -12,
  },
  googleText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#252D1F",
  },
  continueButton: {
    backgroundColor: "#252D1F",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    position: "absolute",
    bottom: 130,
    width: "90%",
  },
  continueText: {
    color: "#FFF9F0",
    fontSize: 23,
    fontWeight: "600",
  },
});
