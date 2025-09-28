import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Beacon",
        tabBarActiveTintColor: "#2A332A",
        tabBarInactiveTintColor: "#9AA39A",
        tabBarStyle: { backgroundColor: "#F5F1E9" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sp"
        options={{
          title: "Safe Places",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="place" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="contacts" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
