
import { View, Text, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";

type Props = {
  title?: string;
  body: string;
  isLast?: boolean;
  onNext: () => void;
  onClose: () => void;
};

export default function OnboardingPage({
  title,
  body,
  isLast,
  onNext,
  onClose,
}: Props) {
  return (
    <View className="flex-1 bg-[#5D6B4D] p-6 justify-between">
      {/* Close button */}
      <TouchableOpacity
        onPress={onClose}
        className="absolute top-4 right-4 p-2"
      >
        <X size={28} color="#252D1F" />
      </TouchableOpacity>

      {/* Content */}
      <View className="mt-12">
        {title ? (
          <Text className="italic text-xl text-white mb-4">{title}</Text>
        ) : null}

        <View className="h-1 w-24 bg-[#252D1F] rounded-full mb-4" />

        <Text className="text-white text-base leading-6">{body}</Text>
      </View>

      {/* Next/Begin button */}
      <TouchableOpacity
        onPress={onNext}
        className="self-end bg-[#252D1F] px-6 py-3 rounded-2xl"
      >
        <Text className="text-white font-semibold text-lg">
          {isLast ? "Begin!" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
