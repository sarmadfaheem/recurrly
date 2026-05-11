import AuthBrand from "@/components/auth/auth-brand";
import AuthButton from "@/components/auth/auth-button";
import AuthInput from "@/components/auth/auth-input";
import {
  validateCode,
  validateEmail,
  validatePassword,
} from "@/lib/auth-validation";
import { isClerkAPIResponseError } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);
const StyledKAV = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

type SecondFactorStrategy =
  | "phone_code"
  | "email_code"
  | "totp"
  | "backup_code";

type SecondFactorState = {
  strategy: SecondFactorStrategy;
  phoneNumberId?: string;
  emailAddressId?: string;
  safeIdentifier?: string;
};

type Errors = {
  emailAddress?: string;
  password?: string;
  code?: string;
  global?: string;
};

const STRATEGY_PRIORITY: SecondFactorStrategy[] = [
  "totp",
  "phone_code",
  "email_code",
  "backup_code",
];

const pickSecondFactor = (
  supported: ReadonlyArray<{
    strategy: string;
    phoneNumberId?: string;
    emailAddressId?: string;
    safeIdentifier?: string;
  }>,
): SecondFactorState | null => {
  for (const strategy of STRATEGY_PRIORITY) {
    const match = supported.find((f) => f.strategy === strategy);
    if (match) {
      return {
        strategy,
        phoneNumberId: match.phoneNumberId,
        emailAddressId: match.emailAddressId,
        safeIdentifier: match.safeIdentifier,
      };
    }
  }
  return null;
};

const describeSecondFactor = (factor: SecondFactorState): {
  title: string;
  subtitle: string;
  helper: string;
} => {
  switch (factor.strategy) {
    case "phone_code":
      return {
        title: "Enter your SMS code",
        subtitle: `We sent a 6-digit code to ${factor.safeIdentifier ?? "your phone"}.`,
        helper: "Codes expire after 10 minutes",
      };
    case "email_code":
      return {
        title: "Enter your email code",
        subtitle: `We sent a 6-digit code to ${factor.safeIdentifier ?? "your email"}.`,
        helper: "Codes expire after 10 minutes",
      };
    case "totp":
      return {
        title: "Enter your authenticator code",
        subtitle: "Open your authenticator app and enter the 6-digit code.",
        helper: "Codes refresh every 30 seconds",
      };
    case "backup_code":
      return {
        title: "Enter a backup code",
        subtitle: "Use one of the backup codes you saved when you set up 2FA.",
        helper: "Each backup code can only be used once",
      };
  }
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
  const posthog = usePostHog();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [secondFactor, setSecondFactor] =
    React.useState<SecondFactorState | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});

  const passwordRef = React.useRef<TextInput>(null);

  const prepareIfNeeded = async (factor: SecondFactorState) => {
    if (!signIn) return;
    if (factor.strategy === "phone_code" && factor.phoneNumberId) {
      await signIn.prepareSecondFactor({
        strategy: "phone_code",
        phoneNumberId: factor.phoneNumberId,
      });
    } else if (factor.strategy === "email_code" && factor.emailAddressId) {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: factor.emailAddressId,
      });
    }
  };

  const completeSignIn = async (sessionId: string | null) => {
    if (!setActive) return;
    posthog.identify(emailAddress.trim(), {
      $set: { email: emailAddress.trim() },
    });
    posthog.capture("user_signed_in", { method: "email" });
    await setActive({ session: sessionId });
    router.replace("/(tabs)");
  };

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
        await completeSignIn(attempt.createdSessionId);
        return;
      }

      if (attempt.status === "needs_second_factor") {
        const factor = pickSecondFactor(attempt.supportedSecondFactors ?? []);
        if (!factor) {
          setErrors({
            global:
              "Your account requires a second factor, but no supported method was returned. Contact support.",
          });
          return;
        }

        await prepareIfNeeded(factor);
        posthog.capture("user_sign_in_second_factor_required", {
          strategy: factor.strategy,
        });
        setSecondFactor(factor);
        setCode("");
        return;
      }

      setErrors({
        global: `Sign-in incomplete (status: ${attempt.status}).`,
      });
      console.warn("Unexpected signIn status:", attempt.status);
    } catch (err) {
      const message = extractClerkError(err);
      posthog.capture("user_sign_in_failed", { reason: message });
      posthog.capture("$exception", {
        $exception_list: [
          {
            type: err instanceof Error ? err.name : "SignInError",
            value: message,
            stacktrace: { type: "raw", frames: err instanceof Error ? (err.stack ?? "") : "" },
          },
        ],
        $exception_source: "sign-in",
      });
      setErrors((prev) => ({ ...prev, global: message }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySecondFactor = async () => {
    if (!isLoaded || !secondFactor) return;

    const codeError = validateCode(code);
    if (codeError) {
      setErrors((prev) => ({ ...prev, code: codeError }));
      return;
    }

    setSubmitting(true);
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: secondFactor.strategy,
        code: code.trim(),
      });

      if (attempt.status === "complete") {
        posthog.capture("user_sign_in_second_factor_verified", {
          strategy: secondFactor.strategy,
        });
        await completeSignIn(attempt.createdSessionId);
        return;
      }

      setErrors({
        global: `Verification incomplete (status: ${attempt.status}).`,
      });
    } catch (err) {
      const message = extractClerkError(err);
      posthog.capture("$exception", {
        $exception_list: [
          {
            type: err instanceof Error ? err.name : "SecondFactorError",
            value: message,
            stacktrace: { type: "raw", frames: err instanceof Error ? (err.stack ?? "") : "" },
          },
        ],
        $exception_source: "sign-in-second-factor",
      });
      setErrors((prev) => ({ ...prev, code: message }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !secondFactor) return;
    if (
      secondFactor.strategy !== "phone_code" &&
      secondFactor.strategy !== "email_code"
    )
      return;

    setResending(true);
    try {
      await prepareIfNeeded(secondFactor);
      Alert.alert("Code resent", "Check for a fresh 6-digit code.");
    } catch (err) {
      setErrors({ global: extractClerkError(err) });
    } finally {
      setResending(false);
    }
  };

  const handleStartOver = () => {
    setSecondFactor(null);
    setCode("");
    setErrors({});
  };

  if (secondFactor) {
    const copy = describeSecondFactor(secondFactor);
    const canResend =
      secondFactor.strategy === "phone_code" ||
      secondFactor.strategy === "email_code";
    const maxLength = secondFactor.strategy === "backup_code" ? 12 : 6;
    const isNumeric =
      secondFactor.strategy === "phone_code" ||
      secondFactor.strategy === "email_code" ||
      secondFactor.strategy === "totp";

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
            <AuthBrand title={copy.title} subtitle={copy.subtitle} />

            <View className="auth-card">
              <View className="auth-form">
                <AuthInput
                  label="Verification code"
                  value={code}
                  onChangeText={(v) => {
                    setErrors((prev) => ({ ...prev, code: undefined }));
                    const cleaned = isNumeric ? v.replace(/\D/g, "") : v;
                    setCode(cleaned.slice(0, maxLength));
                  }}
                  placeholder={
                    secondFactor.strategy === "backup_code"
                      ? "abcd-efgh"
                      : "123456"
                  }
                  keyboardType={isNumeric ? "number-pad" : "default"}
                  autoCapitalize="none"
                  maxLength={maxLength}
                  autoFocus
                  error={errors.code}
                  helper={copy.helper}
                />

                {errors.global && (
                  <Text className="auth-error">{errors.global}</Text>
                )}

                <AuthButton
                  label="Verify & continue"
                  onPress={handleVerifySecondFactor}
                  loading={submitting}
                  disabled={code.length < (isNumeric ? 6 : 4)}
                />

                {canResend && (
                  <AuthButton
                    variant="secondary"
                    label={resending ? "Sending…" : "Resend code"}
                    onPress={handleResend}
                    loading={resending}
                  />
                )}
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Not your account?</Text>
              <Text className="auth-link" onPress={handleStartOver}>
                Start over
              </Text>
            </View>
          </StyledScrollView>
        </StyledKAV>
      </SafeAreaView>
    );
  }

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
