import React, { useState } from "react";
import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Stack } from "expo-router";
import { Image } from "expo-image";
import TweetFeed from "../components/TweetFeed";
import { RefreshCw } from "lucide-react-native";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would trigger the refresh of tweets
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="flex-row items-center justify-center">
              <Image
                source={{
                  uri: "https://api.dicebear.com/7.x/avataaars/svg?seed=sportingcp",
                }}
                style={{ width: 30, height: 30 }}
                className="rounded-full mr-2"
              />
              <Text className="text-lg font-bold text-green-700">
                Sporting CP Feed
              </Text>
            </View>
          ),
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#1D9F5F"
            colors={["#1D9F5F"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <View className="py-2 px-4 bg-green-700 flex-row items-center justify-center">
          <RefreshCw size={16} color="white" />
          <Text className="text-white text-sm ml-2">
            Pull down to refresh feed
          </Text>
        </View>

        <TweetFeed />
      </ScrollView>
    </SafeAreaView>
  );
}
