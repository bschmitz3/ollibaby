"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

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
    trackEvent("product_viewed", {
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

