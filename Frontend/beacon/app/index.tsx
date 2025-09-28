import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      // Check if the user has completed onboarding
      const completed = await AsyncStorage.getItem("onboardingCompleted");

      if (completed === "true") {
        // Go to main app tabs
        router.replace("/(tabs)");
      } else {
        // Go to onboarding
        router.replace("/Onboarding/First");
      }
    }

    checkOnboarding();
  }, []);

  // Optional: render nothing or a loading indicator
  return null;
}
