import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react-native";

interface TweetCardProps {
  profileImage?: string;
  username?: string;
  handle?: string;
  content?: string;
  timestamp?: string;
  mediaUrl?: string;
  likes?: number;
  retweets?: number;
  comments?: number;
  accountType?: "main" | "modalidades";
}

const TweetCard = ({
  profileImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=sportingcp",
  username = "Sporting CP",
  handle = "@SportingCP",
  content = "Bem-vindos ao nosso novo aplicativo! Fiquem atentos para as últimas notícias do clube. #SportingCP",
  timestamp = "2h",
  mediaUrl,
  likes = 1240,
  retweets = 342,
  comments = 56,
  accountType = "main",
}: TweetCardProps) => {
  // Determine border color based on account type
  const borderColor =
    accountType === "main" ? "border-green-600" : "border-blue-500";

  return (
    <View
      className={`bg-white rounded-xl p-4 mb-4 border ${borderColor} shadow-sm`}
    >
      <View className="flex-row">
        <Image
          source={{ uri: profileImage }}
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="font-bold text-base">{username}</Text>
              <Text className="text-gray-500 ml-1">{handle}</Text>
            </View>
            <Text className="text-gray-500 text-xs">{timestamp}</Text>
          </View>

          <Text className="mt-1 text-base">{content}</Text>

          {mediaUrl && (
            <Image
              source={{ uri: mediaUrl }}
              className="w-full h-48 rounded-lg mt-3 bg-gray-100"
              contentFit="cover"
            />
          )}

          <View className="flex-row justify-between mt-3">
            <TouchableOpacity className="flex-row items-center">
              <MessageCircle size={18} color="#6B7280" />
              <Text className="ml-1 text-gray-500 text-sm">{comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Repeat size={18} color="#6B7280" />
              <Text className="ml-1 text-gray-500 text-sm">{retweets}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Heart size={18} color="#6B7280" />
              <Text className="ml-1 text-gray-500 text-sm">{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Share2 size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TweetCard;
