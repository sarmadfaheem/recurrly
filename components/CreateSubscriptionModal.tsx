import { icons } from "@/constants/icons";
import { matchBrandIcon } from "@/lib/brand-icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const FREQUENCIES = ["Monthly", "Yearly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ffd1ba",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#fde2a8",
  Cloud: "#cfe6ff",
  Music: "#c4f0d8",
  Other: "#e0e0e0",
};

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category>("Other");

  const parsedPrice = useMemo(() => Number(price), [price]);
  const isNameValid = name.trim().length > 0;
  const isPriceValid =
    price.trim() !== "" && Number.isFinite(parsedPrice) && parsedPrice > 0;
  const isValid = isNameValid && isPriceValid;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? startDate.add(1, "month")
        : startDate.add(1, "year");

    const trimmedName = name.trim();
    const brandIcon = matchBrandIcon(trimmedName) ?? undefined;

    const newSubscription: Subscription = {
      id: `${trimmedName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      icon: icons.wallet,
      name: trimmedName,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      price: parsedPrice,
      currency: "USD",
      billing: frequency,
      renewalDate: renewalDate.toISOString(),
      color: CATEGORY_COLORS[category],
      brandIcon,
    };

    onCreate(newSubscription);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="modal-overlay"
      >
        <Pressable className="flex-1" onPress={handleClose} />
        <View className="modal-container">
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              onPress={handleClose}
              className="modal-close"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerClassName="modal-body"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Netflix"
                placeholderTextColor="rgba(0,0,0,0.35)"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="rgba(0,0,0,0.35)"
                keyboardType="decimal-pad"
                className="auth-input"
              />
            </View>

            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {FREQUENCIES.map((option) => {
                  const active = frequency === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setFrequency(option)}
                      className={clsx(
                        "picker-option",
                        active && "picker-option-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          active && "picker-option-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((option) => {
                  const active = category === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setCategory(option)}
                      className={clsx(
                        "category-chip",
                        active && "category-chip-active",
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          active && "category-chip-text-active",
                        )}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              accessibilityRole="button"
              className={clsx(
                "auth-button active:opacity-90",
                !isValid && "auth-button-disabled",
              )}
            >
              <Text className="auth-button-text">Add Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
