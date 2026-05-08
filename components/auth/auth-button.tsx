import { clsx } from "clsx";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
} from "react-native";

type AuthButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  loading?: boolean;
  variant?: "primary" | "secondary";
};

const AuthButton = ({
  label,
  loading,
  disabled,
  variant = "primary",
  ...rest
}: AuthButtonProps) => {
  const isDisabled = disabled || loading;

  if (variant === "secondary") {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        className={clsx(
          "auth-secondary-button",
          isDisabled && "opacity-60",
        )}
        {...rest}
      >
        <Text className="auth-secondary-button-text">{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={clsx(
        "auth-button active:opacity-90",
        isDisabled && "auth-button-disabled",
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#081126" />
      ) : (
        <Text className="auth-button-text">{label}</Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
