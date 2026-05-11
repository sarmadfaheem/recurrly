import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";
import { FontAwesome5 } from "@expo/vector-icons";
import { clsx } from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  paymentMethod,
  status,
  brandIcon,
  expanded,
  onPress,
}: SubscriptionCardProps) => {
  const subMeta =
    category?.trim() ||
    plan?.trim() ||
    (renewalDate ? formatSubscriptionDateTime(renewalDate) : "");

  const details = [
    { label: "Payment Method", value: paymentMethod },
    { label: "Category", value: category },
    {
      label: "Renewal Date",
      value: renewalDate ? formatSubscriptionDateTime(renewalDate) : "",
    },
    { label: "Status", value: status },
  ].filter((row) => row.value);

  return (
    <Pressable
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
      onPress={onPress}
    >
      {/* ── Header ── */}
      <View className="sub-head">
        <View className="sub-main">
          {brandIcon ? (
            <View className="sub-icon items-center justify-center bg-card">
              <FontAwesome5
                name={brandIcon.name}
                brand
                size={36}
                color={brandIcon.color}
              />
            </View>
          ) : (
            <Image source={icon} className="sub-icon" />
          )}
          <View className="sub-copy">
            <Text className="sub-title">{name}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {subMeta}
            </Text>
          </View>
        </View>
        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {/* ── Expanded Details ── */}
      {expanded && (
        <View className="sub-bdy">
          <View className="sub-details">
            {details.map((row) => (
              <View key={row.label} className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">{row.label}:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default SubscriptionCard;
