import type { CanonicalProduct, UnitType } from "./product";

export type RetailerType = "marketplace" | "pharmacy" | "supermarket" | "store";

export type Retailer = {
  id: string;
  name: string;
  type: RetailerType;
  websiteUrl?: string;
  isAffiliateEnabled: boolean;
  /** 0..1 (or 0..100) — to be defined later. */
  reliabilityScore?: number;
};

export type OfferAvailabilityStatus = "available" | "unavailable" | "unknown";

export type Offer = {
  id: string;
  canonicalProductId: CanonicalProduct["id"];
  retailerId: Retailer["id"];
  sellerName?: string;
  titleRaw: string;
  url: string;
  affiliateUrl?: string;
  /** Monetary values are stored in BRL cents. Example: 7990 = R$ 79,90. */
  priceInCents: number;
  shippingPriceInCents?: number;
  totalPriceInCents?: number;
  quantityExtracted: number;
  quantityTotalNormalized: number;
  unitType: UnitType;
  unitPriceWithoutShippingInCents: number;
  unitPriceWithShippingInCents?: number;
  availabilityStatus: OfferAvailabilityStatus;
  deliveryEstimate?: string;
  regionOrZipContext?: string;
  matchConfidence: number;
  quantityConfidence: number;
  /** ISO-8601 datetime string. */
  collectedAt: string;
  /** ISO-8601 datetime string. */
  lastValidatedAt: string;
  isAffiliate: boolean;
  status: "published" | "hidden" | "review";
};
