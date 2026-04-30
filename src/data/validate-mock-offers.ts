import { mockOffers } from "@/data/mock-offers";
import { getCanonicalProducts } from "@/lib/catalog/search";
import {
  getEffectiveUnitPriceInCents,
  isOfferEligibleForRanking,
} from "@/lib/offers";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function main() {
  const errors: string[] = [];

  const products = getCanonicalProducts();
  const productsById = new Map(products.map((p) => [p.id, p]));

  const eligibleOffers = mockOffers.filter(isOfferEligibleForRanking);
  const eligibleOffersByProductId = new Map<string, typeof eligibleOffers>();

  for (const offer of eligibleOffers) {
    const list = eligibleOffersByProductId.get(offer.canonicalProductId);
    if (list) {
      list.push(offer);
    } else {
      eligibleOffersByProductId.set(offer.canonicalProductId, [offer]);
    }
  }

  for (const offer of mockOffers) {
    const product = productsById.get(offer.canonicalProductId);
    if (!product) {
      errors.push(
        `Offer "${offer.id}" references missing canonicalProductId "${offer.canonicalProductId}".`,
      );
      continue;
    }

    if (offer.unitType !== product.unitType) {
      errors.push(
        `Offer "${offer.id}" unitType "${offer.unitType}" does not match product "${product.id}" unitType "${product.unitType}".`,
      );
    }

    if (offer.quantityTotalNormalized !== product.quantity) {
      errors.push(
        `Offer "${offer.id}" quantityTotalNormalized ${offer.quantityTotalNormalized} does not match product "${product.id}" quantity ${product.quantity}.`,
      );
    }

    if (!isFiniteNumber(offer.priceInCents) || offer.priceInCents <= 0) {
      errors.push(
        `Offer "${offer.id}" priceInCents must be a finite number > 0 (got ${String(offer.priceInCents)}).`,
      );
    }

    if (
      !isFiniteNumber(offer.unitPriceWithoutShippingInCents) ||
      offer.unitPriceWithoutShippingInCents <= 0
    ) {
      errors.push(
        `Offer "${offer.id}" unitPriceWithoutShippingInCents must be a finite number > 0 (got ${String(offer.unitPriceWithoutShippingInCents)}).`,
      );
    }

    if (offer.shippingPriceInCents !== undefined) {
      if (
        !isFiniteNumber(offer.shippingPriceInCents) ||
        offer.shippingPriceInCents < 0
      ) {
        errors.push(
          `Offer "${offer.id}" shippingPriceInCents must be a finite number >= 0 when present (got ${String(offer.shippingPriceInCents)}).`,
        );
      }
    }

    if (offer.unitPriceWithShippingInCents !== undefined) {
      if (
        !isFiniteNumber(offer.unitPriceWithShippingInCents) ||
        offer.unitPriceWithShippingInCents <= 0
      ) {
        errors.push(
          `Offer "${offer.id}" unitPriceWithShippingInCents must be a finite number > 0 when present (got ${String(offer.unitPriceWithShippingInCents)}).`,
        );
      }
    }
  }

  if (eligibleOffers.length < 1) {
    errors.push(
      "Expected at least 1 offer eligible for ranking, but found 0.",
    );
  }

  const productIdsWithEligibleOffers = new Set<string>();
  for (const productId of eligibleOffersByProductId.keys()) {
    productIdsWithEligibleOffers.add(productId);
  }

  const productsWithEligibleOffers = products.filter((p) =>
    productIdsWithEligibleOffers.has(p.id),
  );
  const productsWithoutEligibleOffers = products.filter(
    (p) => !productIdsWithEligibleOffers.has(p.id),
  );

  if (productsWithEligibleOffers.length < 1) {
    errors.push("Expected at least 1 product with an eligible offer, but found 0.");
  }

  if (productsWithoutEligibleOffers.length < 1) {
    errors.push(
      "Expected at least 1 product without an eligible offer, but found 0.",
    );
  }

  const productsWhereBestEligibleIsNonAffiliate: string[] = [];
  for (const [productId, offers] of eligibleOffersByProductId.entries()) {
    const bestOffer = offers
      .slice()
      .sort(
        (a, b) =>
          getEffectiveUnitPriceInCents(a) - getEffectiveUnitPriceInCents(b),
      )[0];

    if (bestOffer && bestOffer.isAffiliate === false) {
      productsWhereBestEligibleIsNonAffiliate.push(productId);
    }
  }

  // If the current mocks already contain this scenario, enforce that it keeps existing.
  if (
    productsWhereBestEligibleIsNonAffiliate.length === 0 &&
    eligibleOffers.some((o) => o.isAffiliate === false)
  ) {
    errors.push(
      "Expected at least 1 product where the best eligible offer is non-affiliate, but found 0.",
    );
  }

  console.log("Mock offers validation summary");
  console.log(`- totalProducts: ${products.length}`);
  console.log(`- totalOffers: ${mockOffers.length}`);
  console.log(`- totalEligibleOffers: ${eligibleOffers.length}`);
  console.log(`- productsWithEligibleOffer: ${productsWithEligibleOffers.length}`);
  console.log(
    `- productsWithoutEligibleOffer: ${productsWithoutEligibleOffers.length}`,
  );

  if (errors.length > 0) {
    console.error("\nMock offers validation failed.\n");
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log("\nMock offers validation passed.");
}

main();

