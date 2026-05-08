import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import image from "@/constants/image";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const joinedName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
  const fullName = user?.fullName ?? (joinedName || "Recurrly member");
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : image.avatar;

  const handleSignOut = () => {
    Alert.alert("Sign out", "You'll need to sign in again to track renewals.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
          } catch (err) {
            const message =
              err instanceof Error
                ? err.message
                : "Something went wrong. Please try again.";
            Alert.alert("Sign out failed", message);
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary">Settings</Text>

      <View className="mt-6 flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <Image source={avatarSource} className="size-14 rounded-full" />
        <View className="flex-1">
          <Text className="text-lg font-sans-bold text-primary" numberOfLines={1}>
            {fullName}
          </Text>
          {email ? (
            <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleSignOut}
        disabled={signingOut}
        className="mt-6 items-center rounded-2xl bg-primary py-4 active:opacity-90 disabled:opacity-50"
      >
        <Text className="text-base font-sans-bold text-background">
          {signingOut ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
