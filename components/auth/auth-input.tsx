import { clsx } from "clsx";
import { forwardRef } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
  label: string;
  error?: string | null;
  helper?: string;
};

const AuthInput = forwardRef<TextInput, AuthInputProps>(
  ({ label, error, helper, ...rest }, ref) => {
    return (
      <View className="auth-field">
        <Text className="auth-label">{label}</Text>
        <TextInput
          ref={ref}
          placeholderTextColor="rgba(0,0,0,0.35)"
          className={clsx("auth-input", error && "auth-input-error")}
          {...rest}
        />
        {error ? (
          <Text className="auth-error">{error}</Text>
        ) : helper ? (
          <Text className="auth-helper">{helper}</Text>
        ) : null}
      </View>
    );
  },
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
