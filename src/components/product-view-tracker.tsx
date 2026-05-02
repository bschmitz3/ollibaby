"use client";

import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/lib/analytics";

export type ProductViewTrackerProps = {
  productId: string;
  category: string;
  brand: string;
  line: string;
  quantity: number;
  unitType: string;
  rankedOffersCount: number;
};

export function ProductViewTracker({
  productId,
  category,
  brand,
  line,
  quantity,
  unitType,
  rankedOffersCount,
}: ProductViewTrackerProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvent.CANONICAL_PRODUCT_VIEWED, {
      productId,
      category,
      brand,
      line,
      quantity,
      unitType,
      rankedOffersCount,
    });
  }, [productId, category, brand, line, quantity, unitType, rankedOffersCount]);

  return null;
}

