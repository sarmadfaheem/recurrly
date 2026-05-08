import AuthBrand from "@/components/auth/auth-brand";
import AuthButton from "@/components/auth/auth-button";
import AuthInput from "@/components/auth/auth-input";
import {
  validateCode,
  validateEmail,
  validatePassword,
  validateRequired,
} from "@/lib/auth-validation";
import { isClerkAPIResponseError } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
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

const SafeAreaView = styled(RNSafeAreaView);
const StyledKAV = styled(KeyboardAvoidingView);
const StyledScrollView = styled(ScrollView);

type Errors = {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  password?: string;
  code?: string;
  global?: string;
};

const extractClerkError = (err: unknown): string => {
  if (isClerkAPIResponseError(err)) {
    return err.errors[0]?.longMessage ?? err.errors[0]?.message ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
};

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});

  const lastNameRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const emailRef = React.useRef<TextInput>(null);

  const handleCreateAccount = async () => {
    if (!isLoaded) return;

    const nextErrors: Errors = {
      firstName: validateRequired(firstName, "First name") ?? undefined,
      lastName: validateRequired(lastName, "Last name") ?? undefined,
      emailAddress: validateEmail(emailAddress) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    setErrors(nextErrors);
    if (
      nextErrors.firstName ||
      nextErrors.lastName ||
      nextErrors.emailAddress ||
      nextErrors.password
    )
      return;

    setSubmitting(true);
    try {
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err) {
      setErrors({ global: extractClerkError(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    const codeError = validateCode(code);
    if (codeError) {
      setErrors((prev) => ({ ...prev, code: codeError }));
      return;
    }

    setSubmitting(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      console.log("[signUp] verify attempt result:", {
        status: attempt.status,
        missingFields: attempt.missingFields,
        unverifiedFields: attempt.unverifiedFields,
        requiredFields: attempt.requiredFields,
        createdSessionId: attempt.createdSessionId,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/(tabs)");
        return;
      }

      const missing = attempt.missingFields?.join(", ") || "unknown";
      setErrors({
        global: `Sign-up incomplete (status: ${attempt.status}). Clerk still needs: ${missing}. Check the dashboard's required fields.`,
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, code: extractClerkError(err) }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    setResending(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Code resent", "Check your inbox for a fresh 6-digit code.");
    } catch (err) {
      setErrors({ global: extractClerkError(err) });
    } finally {
      setResending(false);
    }
  };

  const handleStartOver = () => {
    setPendingVerification(false);
    setCode("");
    setErrors({});
    setEmailAddress("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  if (pendingVerification) {
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
              title="Verify your email"
              subtitle={`We sent a 6-digit code to ${emailAddress.trim()}. Enter it below to activate your account.`}
            />

            <View className="auth-card">
              <View className="auth-form">
                <AuthInput
                  label="Verification code"
                  value={code}
                  onChangeText={(v) => {
                    setErrors((prev) => ({ ...prev, code: undefined }));
                    setCode(v.replace(/\D/g, "").slice(0, 6));
                  }}
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  error={errors.code}
                  helper="Codes expire after 10 minutes"
                />

                {errors.global && (
                  <Text className="auth-error">{errors.global}</Text>
                )}

                <AuthButton
                  label="Verify & continue"
                  onPress={handleVerify}
                  loading={submitting}
                  disabled={code.length < 6}
                />

                <AuthButton
                  variant="secondary"
                  label={resending ? "Sending…" : "Resend code"}
                  onPress={handleResend}
                  loading={resending}
                />
              </View>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Wrong email?</Text>
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
            title="Create your account"
            subtitle="Track every subscription, never miss a renewal, and own your spend."
          />

          <View className="auth-card">
            <View className="auth-form">
              <AuthInput
                label="First name"
                value={firstName}
                onChangeText={(v) => {
                  setErrors((prev) => ({ ...prev, firstName: undefined }));
                  setFirstName(v);
                }}
                placeholder="Alex"
                autoCapitalize="words"
                autoComplete="given-name"
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                error={errors.firstName}
              />

              <AuthInput
                ref={lastNameRef}
                label="Last name"
                value={lastName}
                onChangeText={(v) => {
                  setErrors((prev) => ({ ...prev, lastName: undefined }));
                  setLastName(v);
                }}
                placeholder="Doe"
                autoCapitalize="words"
                autoComplete="family-name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                error={errors.lastName}
              />

              <AuthInput
                ref={emailRef}
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
                placeholder="At least 8 characters"
                autoCapitalize="none"
                autoComplete="password-new"
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleCreateAccount}
                error={errors.password}
                helper="Mix uppercase letters and numbers"
              />

              {errors.global && (
                <Text className="auth-error">{errors.global}</Text>
              )}

              <AuthButton
                label="Create account"
                onPress={handleCreateAccount}
                loading={submitting}
                disabled={
                  !firstName ||
                  !lastName ||
                  !emailAddress ||
                  !password ||
                  !isLoaded
                }
              />

              <View nativeID="clerk-captcha" />
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Already have an account?</Text>
            <Link href="/(auth)/sign-in" replace>
              <Text className="auth-link">Sign in</Text>
            </Link>
          </View>
        </StyledScrollView>
      </StyledKAV>
    </SafeAreaView>
  );
};

export default SignUp;
