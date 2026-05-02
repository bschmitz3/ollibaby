import { getEffectiveUnitPriceInCents } from "@/lib/offers";
import type { Offer } from "@/types/offer";
import type { CanonicalProduct } from "@/types/product";

import { getProductCategoryLabel } from "./product-metadata";

function availabilityToSchema(
  status: Offer["availabilityStatus"],
): string | undefined {
  if (status === "available") return "https://schema.org/InStock";
  if (status === "unavailable") return "https://schema.org/OutOfStock";
  return undefined;
}

export function buildProductJsonLd(
  product: CanonicalProduct,
  baseUrl: string,
  bestOffer?: Offer,
): Record<string, unknown> {
  const productUrl = `${baseUrl}/produtos/${encodeURIComponent(product.id)}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: getProductCategoryLabel(product.category),
    url: productUrl,
  };

  if (product.brand.trim().length > 0) {
    jsonLd.brand = {
      "@type": "Brand",
      name: product.brand,
    };
  }

  if (bestOffer) {
    const unitPriceReais = getEffectiveUnitPriceInCents(bestOffer) / 100;
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: Number(unitPriceReais.toFixed(2)),
      url: productUrl,
    };
    const availability = availabilityToSchema(bestOffer.availabilityStatus);
    if (availability) {
      offer.availability = availability;
    }
    jsonLd.offers = offer;
  }

  return jsonLd;
}
