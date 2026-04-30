import type { Offer } from "@/types/offer";
import {
  calculateUnitPriceInCents,
  calculateUnitPriceWithShippingInCents,
} from "@/lib/pricing";
import { getCanonicalProducts } from "@/lib/catalog/search";
import { mockRetailers } from "@/data/mock-retailers";

const collectedAt = "2026-04-28T12:00:00.000Z";
const lastValidatedAt = "2026-04-28T12:00:00.000Z";

const products = getCanonicalProducts();

function findProductById(productId: string) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    throw new Error(
      `Mock offer references missing canonical product id: "${productId}". Re-generate catalog or update src/data/mock-offers.ts.`
    );
  }
  return product;
}

const pampersConfortSecG52 = findProductById(
  "diaper-pampers-confort-sec-g-fita-regular-52-fralda"
);
const huggiesSupremeCareP44 = findProductById(
  "diaper-huggies-supreme-care-p-fita-regular-44-fralda"
);
const pampersPantsG64 = findProductById(
  "diaper-pampers-pants-g-pants-regular-64-fralda"
);
const huggiesWipes48 = findProductById(
  "wipe-huggies-supreme-care-no-size-regular-pacote-48-lenco"
);
const cottonbabyWipes384 = findProductById(
  "wipe-cottonbaby-baby-no-size-regular-kit-384-lenco"
);

const amazon = mockRetailers[0];
const mercadoLivre = mockRetailers[1];
const drogaria = mockRetailers[2];
const lojaBebe = mockRetailers[3];

export const mockOffers: Offer[] = [
  {
    id: "of_pampers_confortsec_g52_amazon_01",
    canonicalProductId: pampersConfortSecG52.id,
    retailerId: amazon.id,
    titleRaw: "Fralda Pampers Confort Sec G - 52 unidades (mock)",
    url: "https://example.com/offers/of_pampers_confortsec_g52_amazon_01",
    affiliateUrl:
      "https://example.com/offers/of_pampers_confortsec_g52_amazon_01?aff=1",
    priceInCents: 6990,
    shippingPriceInCents: 990,
    totalPriceInCents: 7980,
    quantityExtracted: 52,
    quantityTotalNormalized: 52,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 6990,
      quantity: 52,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 6990,
      shippingPriceInCents: 990,
      quantity: 52,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "2–5 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.96,
    quantityConfidence: 0.95,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_pampers_confortsec_g52_mercadolivre_01",
    canonicalProductId: pampersConfortSecG52.id,
    retailerId: mercadoLivre.id,
    sellerName: "Vendedor Exemplo ML (mock)",
    titleRaw: "Pampers Confort Sec G 52 fraldas (mock)",
    url: "https://example.com/offers/of_pampers_confortsec_g52_mercadolivre_01",
    affiliateUrl:
      "https://example.com/offers/of_pampers_confortsec_g52_mercadolivre_01?aff=1",
    priceInCents: 6790,
    shippingPriceInCents: 1490,
    totalPriceInCents: 8280,
    quantityExtracted: 52,
    quantityTotalNormalized: 52,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 6790,
      quantity: 52,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 6790,
      shippingPriceInCents: 1490,
      quantity: 52,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "3–7 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.94,
    quantityConfidence: 0.93,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_huggies_supremecare_p44_drogaria_01",
    canonicalProductId: huggiesSupremeCareP44.id,
    retailerId: drogaria.id,
    titleRaw: "Huggies Supreme Care P 44 unidades (mock)",
    url: "https://example.com/offers/of_huggies_supremecare_p44_drogaria_01",
    priceInCents: 5590,
    shippingPriceInCents: 0,
    totalPriceInCents: 5590,
    quantityExtracted: 44,
    quantityTotalNormalized: 44,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 5590,
      quantity: 44,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 5590,
      shippingPriceInCents: 0,
      quantity: 44,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "Retirada em loja (mock)",
    regionOrZipContext: "SP (mock)",
    matchConfidence: 0.97,
    quantityConfidence: 0.96,
    collectedAt,
    lastValidatedAt,
    isAffiliate: false,
    status: "published",
  },
  {
    id: "of_huggies_supremecare_p44_amazon_01",
    canonicalProductId: huggiesSupremeCareP44.id,
    retailerId: amazon.id,
    titleRaw: "Fralda Huggies Supreme Care P - 44 unidades (mock)",
    url: "https://example.com/offers/of_huggies_supremecare_p44_amazon_01",
    affiliateUrl:
      "https://example.com/offers/of_huggies_supremecare_p44_amazon_01?aff=1",
    priceInCents: 5890,
    shippingPriceInCents: 790,
    totalPriceInCents: 6680,
    quantityExtracted: 44,
    quantityTotalNormalized: 44,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 5890,
      quantity: 44,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 5890,
      shippingPriceInCents: 790,
      quantity: 44,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "1–4 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.95,
    quantityConfidence: 0.92,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_pampers_pants_g64_lojabebe_01",
    canonicalProductId: pampersPantsG64.id,
    retailerId: lojaBebe.id,
    titleRaw: "Pampers Pants G 64 unidades (mock)",
    url: "https://example.com/offers/of_pampers_pants_g64_lojabebe_01",
    priceInCents: 7490,
    shippingPriceInCents: 1290,
    totalPriceInCents: 8780,
    quantityExtracted: 64,
    quantityTotalNormalized: 64,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 7490,
      quantity: 64,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 7490,
      shippingPriceInCents: 1290,
      quantity: 64,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "4–9 dias úteis (mock)",
    regionOrZipContext: "RJ (mock)",
    matchConfidence: 0.93,
    quantityConfidence: 0.94,
    collectedAt,
    lastValidatedAt,
    isAffiliate: false,
    status: "published",
  },
  {
    id: "of_pampers_pants_g64_mercadolivre_01",
    canonicalProductId: pampersPantsG64.id,
    retailerId: mercadoLivre.id,
    sellerName: "Vendedor Exemplo ML 2 (mock)",
    titleRaw: "Pampers Pants G com 64 (mock)",
    url: "https://example.com/offers/of_pampers_pants_g64_mercadolivre_01",
    affiliateUrl:
      "https://example.com/offers/of_pampers_pants_g64_mercadolivre_01?aff=1",
    priceInCents: 7290,
    shippingPriceInCents: 1990,
    totalPriceInCents: 9280,
    quantityExtracted: 64,
    quantityTotalNormalized: 64,
    unitType: "diaper",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 7290,
      quantity: 64,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 7290,
      shippingPriceInCents: 1990,
      quantity: 64,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "3–10 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.9,
    quantityConfidence: 0.9,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_huggies_wipes_48_amazon_01",
    canonicalProductId: huggiesWipes48.id,
    retailerId: amazon.id,
    titleRaw: "Huggies Lenços Umedecidos Supreme Care 48 (mock)",
    url: "https://example.com/offers/of_huggies_wipes_48_amazon_01",
    affiliateUrl:
      "https://example.com/offers/of_huggies_wipes_48_amazon_01?aff=1",
    priceInCents: 1590,
    shippingPriceInCents: 590,
    totalPriceInCents: 2180,
    quantityExtracted: 48,
    quantityTotalNormalized: 48,
    unitType: "wipe",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 1590,
      quantity: 48,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 1590,
      shippingPriceInCents: 590,
      quantity: 48,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "2–6 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.98,
    quantityConfidence: 0.95,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_huggies_wipes_48_drogaria_01",
    canonicalProductId: huggiesWipes48.id,
    retailerId: drogaria.id,
    titleRaw: "Lenços Umedecidos Huggies Supreme Care 48 un (mock)",
    url: "https://example.com/offers/of_huggies_wipes_48_drogaria_01",
    priceInCents: 1490,
    shippingPriceInCents: 0,
    totalPriceInCents: 1490,
    quantityExtracted: 48,
    quantityTotalNormalized: 48,
    unitType: "wipe",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 1490,
      quantity: 48,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 1490,
      shippingPriceInCents: 0,
      quantity: 48,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "Retirada em loja (mock)",
    regionOrZipContext: "SP (mock)",
    matchConfidence: 0.92,
    quantityConfidence: 0.95,
    collectedAt,
    lastValidatedAt,
    isAffiliate: false,
    status: "published",
  },
  {
    id: "of_cottonbaby_wipes_384_amazon_01",
    canonicalProductId: cottonbabyWipes384.id,
    retailerId: amazon.id,
    titleRaw: "Cottonbaby Lenços Umedecidos 384 (mock)",
    url: "https://example.com/offers/of_cottonbaby_wipes_384_amazon_01",
    affiliateUrl:
      "https://example.com/offers/of_cottonbaby_wipes_384_amazon_01?aff=1",
    priceInCents: 5990,
    shippingPriceInCents: 690,
    totalPriceInCents: 6680,
    quantityExtracted: 384,
    quantityTotalNormalized: 384,
    unitType: "wipe",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 5990,
      quantity: 384,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 5990,
      shippingPriceInCents: 690,
      quantity: 384,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "2–6 dias úteis (mock)",
    regionOrZipContext: "BR (mock)",
    matchConfidence: 0.96,
    quantityConfidence: 0.9,
    collectedAt,
    lastValidatedAt,
    isAffiliate: true,
    status: "published",
  },
  {
    id: "of_cottonbaby_wipes_384_lojabebe_01",
    canonicalProductId: cottonbabyWipes384.id,
    retailerId: lojaBebe.id,
    titleRaw: "Lenços Cottonbaby 384 unidades (mock)",
    url: "https://example.com/offers/of_cottonbaby_wipes_384_lojabebe_01",
    priceInCents: 5790,
    shippingPriceInCents: 1290,
    totalPriceInCents: 7080,
    quantityExtracted: 384,
    quantityTotalNormalized: 384,
    unitType: "wipe",
    unitPriceWithoutShippingInCents: calculateUnitPriceInCents({
      totalPriceInCents: 5790,
      quantity: 384,
    }),
    unitPriceWithShippingInCents: calculateUnitPriceWithShippingInCents({
      priceInCents: 5790,
      shippingPriceInCents: 1290,
      quantity: 384,
    }),
    availabilityStatus: "available",
    deliveryEstimate: "5–12 dias úteis (mock)",
    regionOrZipContext: "MG (mock)",
    matchConfidence: 0.9,
    quantityConfidence: 0.88,
    collectedAt,
    lastValidatedAt,
    isAffiliate: false,
    status: "published",
  },
];

