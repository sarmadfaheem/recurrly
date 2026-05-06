import ListHeading from "@/components/list-heading";
import UpcomingSubscriptionCard from "@/components/upcoming-subscription-card";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import image from "@/constants/image";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="home-header">
        <View className="home-user">
          <Image source={image.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
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
      <View>
        <ListHeading title="Upcoming Renewals" />
        <FlatList
          data={UPCOMING_SUBSCRIPTIONS}
          renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text className="home-empty-state">No upcoming renewals yet!</Text>
          )}
        />
      </View>

      {/* Subscription Cards */}
      <View>
        <ListHeading title="All Subscriptions" />
      </View>
    </SafeAreaView>
  );
}
