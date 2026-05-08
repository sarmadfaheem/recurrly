import logo from "@/assets/icons/logo.png";
import React from "react";
import { Image, Text, View } from "react-native";

type AuthBrandProps = {
  title: string;
  subtitle: string;
};

const AuthBrand = ({ title, subtitle }: AuthBrandProps) => {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <Image source={logo} className="size-14 rounded-2xl" resizeMode="cover" />
        <View>
          <Text className="auth-wordmark">Recurrly</Text>
          <Text className="auth-wordmark-sub">Subscription Tracker</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      <Text className="auth-subtitle">{subtitle}</Text>
    </View>
  );
};

export default AuthBrand;
