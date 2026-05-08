import AuthBrand from "@/components/auth/auth-brand";
import AuthButton from "@/components/auth/auth-button";
import AuthInput from "@/components/auth/auth-input";
import { validateEmail, validatePassword } from "@/lib/auth-validation";
import { isClerkAPIResponseError } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const StyledKAV = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

type Errors = {
  emailAddress?: string;
  password?: string;
  global?: string;
};

const extractClerkError = (err: unknown): string => {
  if (isClerkAPIResponseError(err)) {
    return err.errors[0]?.longMessage ?? err.errors[0]?.message ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});

  const passwordRef = React.useRef<TextInput>(null);

  const handleSubmit = async () => {
    if (!isLoaded) return;

    const nextErrors: Errors = {
      emailAddress: validateEmail(emailAddress) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.emailAddress || nextErrors.password) return;

    setSubmitting(true);
    try {
      const attempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      setErrors({
        global:
          "Additional verification is required. Open the email we sent to continue.",
      });
      console.warn("Unexpected signIn status:", attempt.status);
    } catch (err) {
      setErrors((prev) => ({ ...prev, global: extractClerkError(err) }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <StyledKAV
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="auth-screen"
      >
        <StyledScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthBrand
            title="Welcome back"
            subtitle="Sign in to keep tabs on every subscription and renewal."
          />

          <View className="auth-card">
            <View className="auth-form">
              <AuthInput
                label="Email"
                value={emailAddress}
                onChangeText={(v) => {
                  setErrors((prev) => ({ ...prev, emailAddress: undefined }));
                  setEmailAddress(v);
                }}
                placeholder="you@domain.com"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                error={errors.emailAddress}
              />

              <AuthInput
                ref={passwordRef}
                label="Password"
                value={password}
                onChangeText={(v) => {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                  setPassword(v);
                }}
                placeholder="Enter your password"
                autoCapitalize="none"
                autoComplete="password"
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                error={errors.password}
              />

              {errors.global && (
                <Text className="auth-error">{errors.global}</Text>
              )}

              <AuthButton
                label="Sign in"
                onPress={handleSubmit}
                loading={submitting}
                disabled={!emailAddress || !password || !isLoaded}
              />
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">New to Recurrly?</Text>
            <Link href="/(auth)/sign-up" replace>
              <Text className="auth-link">Create an account</Text>
            </Link>
          </View>
        </StyledScrollView>
      </StyledKAV>
    </SafeAreaView>
  );
};

export default SignIn;
