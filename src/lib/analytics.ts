export type AnalyticsEventName =
  | "search_submitted"
  | "category_filter_clicked"
  | "offer_availability_filter_clicked"
  | "brand_filter_clicked"
  | "size_filter_clicked"
  | "product_viewed"
  | "offer_clicked"
  | "offer_error_report_clicked";

export type AnalyticsEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackEvent(
  name: AnalyticsEventName,
  payload?: AnalyticsEventPayload,
) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "development") return;

  const event = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  console.info("[analytics]", event);
}

