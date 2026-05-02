"use client";

import { useEffect } from "react";

import { AnalyticsEvent, trackEvent } from "@/lib/analytics";

export type OfferViewTrackerProps = {
  productId: string;
  offerId: string;
  retailerId: string;
  sellerName?: string;
  unitPriceInCents: number;
  unitPriceWithShippingInCents?: number;
  isAffiliate: boolean;
  rankPosition: number;
};

export function OfferViewTracker({
  productId,
  offerId,
  retailerId,
  sellerName,
  unitPriceInCents,
  unitPriceWithShippingInCents,
  isAffiliate,
  rankPosition,
}: OfferViewTrackerProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvent.OFFER_VIEWED, {
      productId,
      offerId,
      retailerId,
      sellerName,
      unitPriceInCents,
      unitPriceWithShippingInCents,
      isAffiliate,
      rankPosition,
    });
  }, [
    productId,
    offerId,
    retailerId,
    sellerName,
    unitPriceInCents,
    unitPriceWithShippingInCents,
    isAffiliate,
    rankPosition,
  ]);

  return null;
}
