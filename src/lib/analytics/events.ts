export const AnalyticsEvent = {
  SEARCH_PERFORMED: "search_performed",
  CANONICAL_PRODUCT_VIEWED: "canonical_product_viewed",
  OFFER_CLICKED: "offer_clicked",
  AFFILIATE_LINK_CLICKED: "affiliate_link_clicked",
  NON_AFFILIATE_LINK_CLICKED: "non_affiliate_link_clicked",
  ERROR_REPORTED: "error_reported",
  CATEGORY_FILTER_CLICKED: "category_filter_clicked",
  OFFER_AVAILABILITY_FILTER_CLICKED: "offer_availability_filter_clicked",
  BRAND_FILTER_CLICKED: "brand_filter_clicked",
  SIZE_FILTER_CLICKED: "size_filter_clicked",
  PRODUCT_WITHOUT_OFFER_VIEWED: "product_without_offer_viewed",
  OFFER_VIEWED: "offer_viewed",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent];

export type AnalyticsEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;
