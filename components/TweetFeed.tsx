import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import TweetCard from "./TweetCard";

interface Tweet {
  id: string;
  username: string;
  handle: string;
  profileImage: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
  media?: string[];
  isFromMainAccount: boolean;
}

interface TweetFeedProps {
  mainAccountTweets?: Tweet[];
  modalidadesTweets?: Tweet[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
}

const TweetFeed: React.FC<TweetFeedProps> = ({
  mainAccountTweets = [],
  modalidadesTweets = [],
  isLoading = false,
  onRefresh = () => {},
  onLoadMore = () => {},
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [mergedTweets, setMergedTweets] = useState<Tweet[]>([]);

  // Merge and sort tweets from both accounts
  useEffect(() => {
    const allTweets = [...mainAccountTweets, ...modalidadesTweets];

    // Sort by timestamp (newest first)
    const sortedTweets = allTweets.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setMergedTweets(sortedTweets);
  }, [mainAccountTweets, modalidadesTweets]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  // Generate mock data if no tweets are provided
  useEffect(() => {
    if (mainAccountTweets.length === 0 && modalidadesTweets.length === 0) {
      const mockTweets: Tweet[] = [
        {
          id: "1",
          username: "Sporting CP",
          handle: "@SportingCP",
          profileImage:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=SportingCP",
          content:
            "Grande vitória hoje no estádio! Rumo ao título! 💚🦁 #SportingCP",
          timestamp: "2023-05-15T18:30:00Z",
          likes: 5243,
          retweets: 1203,
          comments: 342,
          media: [
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
          ],
          isFromMainAccount: true,
        },
        {
          id: "2",
          username: "Sporting CP Modalidades",
          handle: "@SCPModalidades",
          profileImage:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=SCPModalidades",
          content:
            "Parabéns à nossa equipa de futsal pela vitória na Taça de Portugal! 🏆 #FutsalSCP",
          timestamp: "2023-05-14T20:15:00Z",
          likes: 2134,
          retweets: 587,
          comments: 129,
          media: [
            "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=600&q=80",
          ],
          isFromMainAccount: false,
        },
        {
          id: "3",
          username: "Sporting CP",
          handle: "@SportingCP",
          profileImage:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=SportingCP",
          content:
            "Convocatória para o jogo de amanhã contra o FC Porto. #DiaDeSporting",
          timestamp: "2023-05-13T12:45:00Z",
          likes: 3876,
          retweets: 921,
          comments: 456,
          isFromMainAccount: true,
        },
        {
          id: "4",
          username: "Sporting CP Modalidades",
          handle: "@SCPModalidades",
          profileImage:
            "https://api.dicebear.com/7.x/avataaars/svg?seed=SCPModalidades",
          content:
            "A nossa equipa de basquetebol garantiu o apuramento para a final! Vamos Sporting! 🏀",
          timestamp: "2023-05-12T19:20:00Z",
          likes: 1543,
          retweets: 412,
          comments: 87,
          media: [
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
          ],
          isFromMainAccount: false,
        },
      ];

      setMergedTweets(mockTweets);
    }
  }, [mainAccountTweets, modalidadesTweets]);

  // Render footer with loading indicator when loading more tweets
  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View className="py-4 flex items-center justify-center">
        <ActivityIndicator size="large" color="#1D9F5F" />
      </View>
    );
  };

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) return null;

    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-500 text-lg">Nenhum tweet disponível</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={mergedTweets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TweetCard tweet={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#1D9F5F"]} // Sporting CP green
            tintColor="#1D9F5F"
          />
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ flexGrow: 1 }}
        className="w-full"
      />
    </View>
  );
};

export default TweetFeed;
