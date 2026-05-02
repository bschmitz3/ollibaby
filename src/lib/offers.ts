import type { Offer } from "@/types/offer";

export const MIN_MATCH_CONFIDENCE = 0.85;
export const MIN_QUANTITY_CONFIDENCE = 0.85;

export function getEffectiveUnitPriceInCents(offer: Offer): number {
  if (typeof offer.unitPriceWithShippingInCents === "number" && Number.isFinite(offer.unitPriceWithShippingInCents)) {
    return offer.unitPriceWithShippingInCents;
  }

  return offer.unitPriceWithoutShippingInCents;
}

export function isOfferEligibleForRanking(offer: Offer): boolean {
  if (offer.status !== "published") return false;
  if (offer.availabilityStatus !== "available") return false;
  if (offer.matchConfidence < MIN_MATCH_CONFIDENCE) return false;
  if (offer.quantityConfidence < MIN_QUANTITY_CONFIDENCE) return false;

  const effectiveUnitPriceInCents = getEffectiveUnitPriceInCents(offer);
  if (!Number.isFinite(effectiveUnitPriceInCents)) return false;

  return true;
}

export function sortOffersByBestEffectiveUnitPrice(offers: Offer[]): Offer[] {
  // Ranking must prioritize the best deal for the user. Affiliate status is NOT a sorting criterion.
  return offers
    .filter(isOfferEligibleForRanking)
    .slice()
    .sort((a, b) => {
      const priceA = getEffectiveUnitPriceInCents(a);
      const priceB = getEffectiveUnitPriceInCents(b);

      if (priceA !== priceB) return priceA - priceB;
      if (a.matchConfidence !== b.matchConfidence) {
        return b.matchConfidence - a.matchConfidence;
      }
      if (a.quantityConfidence !== b.quantityConfidence) {
        return b.quantityConfidence - a.quantityConfidence;
      }
      return 0;
    });
}

export function getRankedOffersForProduct(
  offers: Offer[],
  canonicalProductId: string,
): Offer[] {
  return sortOffersByBestEffectiveUnitPrice(
    offers.filter((offer) => offer.canonicalProductId === canonicalProductId),
  );
}

export function getOfferById(
  offers: Offer[],
  offerId: string,
): Offer | undefined {
  return offers.find((offer) => offer.id === offerId);
}
