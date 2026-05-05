import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const onboarding = () => {
  return (
    <View>
      <Text>onboarding</Text>
      <Link href="/" replace className="p-4 bg-black m-2 text-white">
        Go Back
      </Link>
    </View>
  );
};

export default onboarding;
