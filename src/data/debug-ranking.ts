import { mockProducts } from "@/data/mock-products";
import { mockOffers } from "@/data/mock-offers";
import {
  getEffectiveUnitPriceInCents,
  getRankedOffersForProduct,
} from "@/lib/offers";
import { formatUnitPriceFromCents } from "@/lib/formatters";

export function debugRanking(): void {
  for (const product of mockProducts) {
    const rankedOffers = getRankedOffersForProduct(mockOffers, product.id);

    console.log("—".repeat(72));
    console.log(
      `Produto: ${product.brand} ${product.line} — ${product.name}${
        product.size ? ` (${product.size})` : ""
      }`,
    );
    console.log(
      `Quantidade: ${product.quantity} | unitType: ${product.unitType} | ofertas ranqueáveis: ${rankedOffers.length}`,
    );

    if (rankedOffers.length === 0) {
      console.log("Sem ofertas ranqueáveis para este produto.");
      continue;
    }

    for (let idx = 0; idx < rankedOffers.length; idx += 1) {
      const offer = rankedOffers[idx];
      const effectiveUnitPriceInCents = getEffectiveUnitPriceInCents(offer);
      const effectiveUnitPriceLabel = formatUnitPriceFromCents(
        effectiveUnitPriceInCents,
        offer.unitType,
      );

      console.log(
        `${idx + 1}. ${offer.id} | ${effectiveUnitPriceLabel} | affiliate=${offer.isAffiliate} | match=${offer.matchConfidence.toFixed(
          2,
        )} | qty=${offer.quantityConfidence.toFixed(2)}`,
      );
    }
  }

  console.log("—".repeat(72));
}

debugRanking();
