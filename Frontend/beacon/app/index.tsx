import React, { useEffect }  from "react";
import { View, Image, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function ActualSplash() {
  const router = useRouter();

  
    useEffect(() => {
      const timer = setTimeout(() => {
        router.push("/Onboarding/First"); // navigate to First.tsx
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // cleanup on unmount
    }, []);

      const handlePress = () => {
        router.push("/Onboarding/First"); // navigate to First.tsx
        
      };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/beacon-logo.png")} // adjust path if needed
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Beacon</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252D1F", // dark green background
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  appName: {
    position: "absolute",
    bottom: 50,
    fontSize: 28,
    color: "#F4E3CC",
    fontWeight: "bold",
  },
});
