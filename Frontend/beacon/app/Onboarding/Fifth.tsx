import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function Fifth() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>You're Ready!</Text>

      {/* Beacon Logo */}
      <Image
        source={require("../../assets/images/beacon-logo2.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Description */}
      <Text style={styles.body}>
        Everything is set — your journey starts here.{"\n\n"}
        Travel safely, stay connected, and know that
        help is just a tap away.
      </Text>

      {/* Begin Button */}
      <TouchableOpacity
        style={styles.beginButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.beginText}>Begin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5D6B4D", 
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFF9F0", 
    marginBottom: 30,
    textAlign: "center",

  },
  logo: {
    width: 320,
    height: 350,
    marginBottom: -100,
    marginTop: -30,
    position: "relative",
    left: 10,
    
  },
  body: {
    color: "#FFF9F0", 
    fontSize: 21,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 60,
  },
  beginButton: {
    backgroundColor: "#252D1F", 
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
    position: "absolute",
    bottom: 140,

  },
  beginText: {
    color: "#FFF9F0", 
    fontSize: 22,
    fontWeight: "600",
  },
});
