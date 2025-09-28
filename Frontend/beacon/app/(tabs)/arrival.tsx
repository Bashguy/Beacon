import { View, Text, StyleSheet, Image } from "react-native";

export default function Arrival() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/arrival-icon.png")} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>You&apos;ve Arrived!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252D1F", 
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  text: {
    fontSize: 30,
    fontWeight: "600",
    color: "#F4E3CC", 
    top: -20,
  },
});
