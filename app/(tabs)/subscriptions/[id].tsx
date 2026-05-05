import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionsDetails = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Subscriptions Details: {id}</Text>
      <Link href="/" className="mt-4 rounded bg-primary text-white p-4">
        Go Back
      </Link>
    </View>
  );
};

export default SubscriptionsDetails;
