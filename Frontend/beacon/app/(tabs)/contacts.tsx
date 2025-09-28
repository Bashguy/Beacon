import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

// Example type – replace with your Firestore type later
type Contact = { id: string; name: string; phone: string };

export default function ContactsScreen() {
  // TODO: replace with Firestore subscription
  const contacts: Contact[] = [];

  const onAdd = () => {
    // TODO: router.push("/contact/new") when you add the form
    Alert.alert("New Contact", "Hook this up to your Add Contact form.");
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-3 border border-black/10">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-[#2A332A] items-center justify-center">
          <MaterialIcons name="person" size={22} color="#F5F1E9" />
        </View>
        <View>
          <Text className="text-base text-[#2A332A] font-semibold">
            {item.name}
          </Text>
          <Text className="text-sm text-black/60">{item.phone}</Text>
        </View>
      </View>
      <Pressable
        onPress={() => Alert.alert("Coming soon", "Edit / Delete actions")}
      >
        <MaterialIcons name="more-vert" size={22} color="#2A332A" />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#2A332A] items-center justify-center">
      <View className="w-11/12 h-[90%] bg-[#F5F1E9] rounded-3xl p-6 relative">
        <Pressable
          className="absolute right-4 top-4"
          accessibilityLabel="Close"
          onPress={() => router.back()}
        >
          <Text className="text-xl text-[#B8A792]">X</Text>
        </Pressable>

        {/* Header icon */}
        <View className="items-center mt-2">
          <View className="w-20 h-20 rounded-full bg-[#2A332A] items-center justify-center mb-5">
            <MaterialIcons name="person" size={40} color="#F5F1E9" />
          </View>
          <Text className="text-[28px] font-semibold text-center text-[#2A332A] leading-8">
            Emergency{"\n"}Contacts
          </Text>
        </View>

        {/* Content */}
        {contacts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-base text-black/40 px-6">
              Your contact list is empty.{`\n`}Contacts you add will appear
              here.
            </Text>
          </View>
        ) : (
          <FlatList
            className="mt-6"
            contentContainerStyle={{ paddingBottom: 96 }}
            data={contacts}
            keyExtractor={(c) => c.id}
            renderItem={renderItem}
          />
        )}

        {/* New Contact button */}
        <Pressable
          onPress={onAdd}
          className="absolute left-6 right-6 bottom-6 h-14 bg-[#2A332A] rounded-xl items-center justify-center"
        >
          <Text className="text-[#F5F1E9] text-lg font-semibold">
            New Contact
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
