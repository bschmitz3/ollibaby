import posthog from "posthog-js";

import type { AnalyticsEventName, AnalyticsEventPayload } from "./events";

export function trackEvent(
  name: AnalyticsEventName,
  payload?: AnalyticsEventPayload,
): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", {
      name,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(name, payload);
  }

  // Integration point: add additional providers here (e.g. GA4) when ready.
}
