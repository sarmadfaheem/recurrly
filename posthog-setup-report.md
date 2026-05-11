<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Recurrly Expo app. Here is a summary of all changes made:

- **`src/config/posthog.ts`** — New PostHog client singleton configured via `expo-constants` and `app.config.js` extras. Includes batching, debug mode, and lifecycle capture.
- **`app.config.js`** — Converted from `app.json` to `app.config.js` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as `extra` values accessible via `Constants.expoConfig.extra`.
- **`.env`** — PostHog token and host written as `POSTHOG_PROJECT_TOKEN` / `POSTHOG_HOST`.
- **`app/_layout.tsx`** — Wrapped the app with `PostHogProvider` (inside `ClerkProvider`). Added manual screen tracking with `posthog.screen()` in a `useEffect` triggered by `usePathname` / `useGlobalSearchParams`.
- **`app/(auth)/sign-in.tsx`** — Added `posthog.identify()` + `user_signed_in` capture on success; `user_sign_in_failed` + `$exception` capture on error.
- **`app/(auth)/sign-up.tsx`** — Added `user_sign_up_initiated` capture after verification code send; `posthog.identify()` + `user_signed_up` capture on verified account creation; `$exception` capture on errors.
- **`app/(tabs)/settings.tsx`** — Added `user_signed_out` capture + `posthog.reset()` before Clerk sign-out.
- **`app/(tabs)/index.tsx`** — Added `subscription_expanded` / `subscription_collapsed` events on card press with subscription name and ID properties.

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with email and password via Clerk | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | User sign-in attempt failed due to invalid credentials or Clerk error | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes sign-up flow and email is verified, account is created | `app/(auth)/sign-up.tsx` |
| `user_sign_up_initiated` | User submits sign-up form and email verification code is sent | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User successfully signs out via the Settings screen | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User taps a subscription card to expand and view its details | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | User taps an expanded subscription card to collapse it | `app/(tabs)/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/672430)
- [Sign-up funnel: initiated → completed](/insights/kFzv50DJ)
- [Daily sign-ins](/insights/EkYKPcVj)
- [New sign-ups over time](/insights/bVonDjjN)
- [Subscription engagement](/insights/S8kTpaZD)
- [User churn (sign-outs)](/insights/LPj158U3)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
