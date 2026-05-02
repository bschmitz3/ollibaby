import { formatUnitPriceFromCents } from "@/lib/formatters";
import type { CanonicalProduct } from "@/types/product";

export function getProductCategoryLabel(category: CanonicalProduct["category"]): string {
  return category === "diaper" ? "Fraldas" : "Lenços umedecidos";
}

export function buildProductMetaTitle(product: CanonicalProduct): string {
  return `${product.name} | Comparar preço por unidade | Ollibaby`;
}

export function buildProductMetaDescription(
  product: CanonicalProduct,
  bestUnitPriceInCents?: number,
): string {
  const unitPlural = product.unitType === "diaper" ? "fraldas" : "lenços";
  let description = `Compare preço por unidade (${unitPlural}), ofertas ranqueadas e histórico de preço quando disponível para ${product.name} (${product.brand}) no Ollibaby.`;
  if (bestUnitPriceInCents !== undefined) {
    description += ` Melhor oferta ranqueável: ${formatUnitPriceFromCents(bestUnitPriceInCents, product.unitType)}.`;
  }
  return description;
}
