import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/list-heading";
import SubscriptionCard from "@/components/subscription-card";
import UpcomingSubscriptionCard from "@/components/upcoming-subscription-card";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import image from "@/constants/image";
import "@/global.css";
import { useSubscriptionsStore } from "@/lib/subscriptions-store";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const subscriptions = useSubscriptionsStore((state) => state.subscriptions);
  const addSubscription = useSubscriptionsStore((state) => state.addSubscription);
  const { user } = useUser();
  const posthog = usePostHog();
  const displayName =
    user?.firstName ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "there";
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : image.avatar;

  const handleCreateSubscription = (newSubscription: Subscription) => {
    addSubscription(newSubscription);
    posthog.capture("subscription_created", {
      subscription_id: newSubscription.id,
      name: newSubscription.name,
      category: newSubscription.category,
      billing: newSubscription.billing,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Subscription Cards */}
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View className="home-header">
              <View className="home-user">
                <Image source={avatarSource} className="home-avatar" />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable
                onPress={() => setCreateModalOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Add subscription"
              >
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            {/* Balance Card */}
            <View className="home-balance-card">
              <Text className="home-balance-label">Current Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            {/* Upcoming Renewals */}
            <View className="mb-5">
              <ListHeading title="Upcoming Renewals" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text className="home-empty-state">
                    No upcoming renewals yet!
                  </Text>
                )}
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubId === item.id}
            onPress={() => {
              const isExpanded = expandedSubId === item.id;
              if (isExpanded) {
                posthog.capture("subscription_collapsed", { subscription_id: item.id, name: item.name });
              } else {
                posthog.capture("subscription_expanded", { subscription_id: item.id, name: item.name });
              }
              setExpandedSubId((currentId) =>
                currentId === item.id ? null : item.id,
              );
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text className="home-empty-state">No subscriptions found!</Text>
        )}
        contentContainerClassName="pb-30"
      />

      <CreateSubscriptionModal
        visible={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}
