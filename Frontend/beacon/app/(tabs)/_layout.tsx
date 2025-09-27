import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerTitle: "Beacon" }}>
      <Tabs.Screen name="index" options={{ title: "Map" }} />
    </Tabs>
  );
}
