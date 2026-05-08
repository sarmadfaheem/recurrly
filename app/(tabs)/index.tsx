import ListHeading from "@/components/list-heading";
import SubscriptionCard from "@/components/subscription-card";
import UpcomingSubscriptionCard from "@/components/upcoming-subscription-card";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import image from "@/constants/image";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const { user } = useUser();
  const displayName =
    user?.firstName ??
    user?.fullName ??
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ??
    "there";
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : image.avatar;

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
              <Image source={icons.add} className="home-add-icon" />
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
        data={HOME_SUBSCRIPTIONS}
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
          <Text className="home-empty-state">No subscriptions found!</Text>
        )}
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
