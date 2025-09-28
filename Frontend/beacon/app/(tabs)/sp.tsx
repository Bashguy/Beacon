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

// Example type – replace with Firestore type later
type SafePlace = { id: string; label: string; address?: string };

export default function SafePlacesScreen() {
  // TODO: replace with Firestore subscription
  const places: SafePlace[] = [];

  const onAdd = () => {
    // TODO: router.push("/sp/new") when you add the form
    Alert.alert("New Safe Place", "Hook this up to your Add Safe Place form.");
  };

  const renderItem = ({ item }: { item: SafePlace }) => (
    <View className="flex-row items-center justify-between bg-white rounded-xl px-4 py-3 mb-3 border border-black/10">
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-[#2A332A] items-center justify-center">
          <MaterialIcons name="home" size={22} color="#F5F1E9" />
        </View>
        <View>
          <Text className="text-base text-[#2A332A] font-semibold">
            {item.label}
          </Text>
          {!!item.address && (
            <Text className="text-sm text-black/60">{item.address}</Text>
          )}
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
            <MaterialIcons name="home" size={40} color="#F5F1E9" />
          </View>
          <Text className="text-[28px] font-semibold text-center text-[#2A332A] leading-8">
            Safe Places
          </Text>
        </View>

        {/* Content */}
        {places.length === 0 ? (
          <View className="flex-1 items-center justify-center -translate-y-20">
            <Text className="text-center text-base text-black/40 px-6">
              Your safe places list is empty.{`\n`}Safe places you add will
              appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            className="mt-6"
            contentContainerStyle={{ paddingBottom: 96 }}
            data={places}
            keyExtractor={(p) => p.id}
            renderItem={renderItem}
          />
        )}

        {/* New Safe Place button */}
        <Pressable
          onPress={onAdd}
          className="absolute left-6 right-6 bottom-6 h-14 bg-[#2A332A] rounded-xl items-center justify-center"
        >
          <Text className="text-[#F5F1E9] text-lg font-semibold">
            Add Safe Place
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
