import SubscriptionCard from "@/components/subscription-card";
import { useSubscriptionsStore } from "@/lib/subscriptions-store";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [query, setQuery] = useState("");
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);

  const filteredSubscriptions = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return subscriptions;

    return subscriptions.filter((sub) => {
      const haystack = [sub.name, sub.category, sub.plan]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [query, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="list-title mb-4">Subscriptions</Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search subscriptions"
        placeholderTextColor="rgba(0,0,0,0.4)"
        className="auth-input mb-4"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      <FlatList
        data={filteredSubscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubId === item.id}
            onPress={() =>
              setExpandedSubId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text className="home-empty-state">
            {query.trim()
              ? `No subscriptions match "${query.trim()}"`
              : "No subscriptions found!"}
          </Text>
        )}
        contentContainerClassName="pb-30"
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
