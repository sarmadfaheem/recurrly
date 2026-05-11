import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { create } from "zustand";

type SubscriptionsState = {
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
};

export const useSubscriptionsStore = create<SubscriptionsState>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (sub) =>
    set((state) => ({ subscriptions: [sub, ...state.subscriptions] })),
}));
