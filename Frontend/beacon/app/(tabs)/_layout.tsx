import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Beacon",
        headerStyle: { backgroundColor: "#F5F1E9" },
        tabBarActiveTintColor: "#2A332A",
        tabBarInactiveTintColor: "#9AA39A",
        tabBarStyle: { backgroundColor: "#F5F1E9" },
        tabBarLabelStyle: { textAlign: "center", fontSize: 14 },
        tabBarItemStyle: { justifyContent: "center", alignItems: "center" },
        tabBarIconStyle: { justifyContent: "center", alignItems: "center" }, // ensures icons are centered
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" color={color} size={size} />
          ),
          tabBarItemStyle: {
      transform: [{ translateX: -0 }],
          }
        }}
      />

      <Tabs.Screen
        name="sp"
        options={{
          tabBarLabel: "Safe Places",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="place" color={color} size={size} />
          ),
          tabBarItemStyle: {
      transform: [{ translateX: 15 }],
          }
        }}
      />

      <Tabs.Screen
        name="contacts"
        options={{
          tabBarLabel: "Contacts",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="contacts" color={color} size={size} />
          ),
          tabBarItemStyle: {
      transform: [{ translateX: 55 }],
          }
        }}
      />

      <Tabs.Screen
        name="arrival"
        options={{
          tabBarButton: () => null, // hide from tab bar
          headerShown: false,       // hide header
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
