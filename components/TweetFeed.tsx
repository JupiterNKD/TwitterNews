import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import TweetCard from "./TweetCard";
import { fetchAllTweets } from "../services/twitterService";
import { Tweet } from "../types/twitter";

interface TweetFeedProps {
  mainAccountTweets?: Tweet[];
  modalidadesTweets?: Tweet[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
}

const TweetFeed: React.FC<TweetFeedProps> = ({
  mainAccountTweets: propMainAccountTweets = [],
  modalidadesTweets: propModalidadesTweets = [],
  isLoading: propIsLoading = false,
  onRefresh = () => {},
  onLoadMore = () => {},
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [mergedTweets, setMergedTweets] = useState<Tweet[]>([]);
  const [mainAccountTweets, setMainAccountTweets] = useState<Tweet[]>(
    propMainAccountTweets,
  );
  const [modalidadesTweets, setModalidadesTweets] = useState<Tweet[]>(
    propModalidadesTweets,
  );
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [error, setError] = useState<string | null>(null);

  // Twitter URLs from the PRD
  const mainAccountUrl =
    "https://x.com/sportingcp?s=21&t=w1LNzbwfMeurEBhTVE-b-Q";
  const modalidadesUrl =
    "https://x.com/scpmodalidades?s=21&t=w1LNzbwfMeurEBhTVE-b-Q";

  // Fetch tweets from Twitter API
  const fetchTweets = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching tweets from URLs:", {
        mainAccountUrl,
        modalidadesUrl,
      });
      const {
        mainAccountTweets: mainTweets,
        modalidadesTweets: modalidadesTweets,
      } = await fetchAllTweets(mainAccountUrl, modalidadesUrl);

      console.log("Tweets fetched successfully:", {
        mainCount: mainTweets.length,
        modalidadesCount: modalidadesTweets.length,
      });

      if (mainTweets.length === 0 && modalidadesTweets.length === 0) {
        setError(
          "No tweets found. Twitter API may have rate limited your requests.",
        );
      } else {
        setMainAccountTweets(mainTweets);
        setModalidadesTweets(modalidadesTweets);
      }
    } catch (err: any) {
      console.error("Error fetching tweets:", err);
      // Provide more specific error messages based on the error
      if (err.message && err.message.includes("rate limit")) {
        setError("Twitter API rate limit exceeded. Please try again later.");
      } else if (
        err.message &&
        err.message.includes("Failed to fetch user data")
      ) {
        setError(
          "Failed to find Twitter accounts. Please check the Twitter handles.",
        );
      } else {
        setError("Failed to fetch tweets. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (
      propMainAccountTweets.length === 0 &&
      propModalidadesTweets.length === 0
    ) {
      fetchTweets();
    }
  }, []);

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
    fetchTweets().finally(() => {
      setRefreshing(false);
      onRefresh();
    });
  }, [onRefresh]);

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

    if (error) {
      return (
        <View className="flex-1 items-center justify-center py-10 px-4">
          <Text className="text-red-500 text-lg text-center">{error}</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Pull down to try again
          </Text>
        </View>
      );
    }

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
        renderItem={({ item }) => (
          <TweetCard
            profileImage={item.profileImage}
            username={item.username}
            handle={item.handle}
            content={item.content}
            timestamp={new Date(item.timestamp).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
            mediaUrl={item.media?.[0]}
            likes={item.likes}
            retweets={item.retweets}
            comments={item.comments}
            accountType={item.isFromMainAccount ? "main" : "modalidades"}
          />
        )}
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
