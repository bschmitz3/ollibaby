"use client";

import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/lib/analytics";

export type ProductWithoutOfferTrackerProps = {
  productId: string;
  productName: string;
  category: string;
  brand: string;
  line: string;
  size: string | null;
  eligibleOffersCount: number;
};

export function ProductWithoutOfferTracker({
  productId,
  productName,
  category,
  brand,
  line,
  size,
  eligibleOffersCount,
}: ProductWithoutOfferTrackerProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvent.PRODUCT_WITHOUT_OFFER_VIEWED, {
      productId,
      productName,
      category,
      brand,
      line,
      size,
      eligibleOffersCount,
    });
  }, [productId, productName, category, brand, line, size, eligibleOffersCount]);

  return null;
}
