import type { CanonicalProduct } from "@/types/product";

export type SearchProductsInput = {
  products: CanonicalProduct[];
  query: string;
};

const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getProductSearchText(product: CanonicalProduct): string {
  const parts: string[] = [];

  parts.push(product.brand);
  parts.push(product.line);
  parts.push(product.name);
  parts.push(product.category);

  if (product.size) parts.push(product.size);
  if (product.type) parts.push(product.type);
  if (product.weightRange) parts.push(product.weightRange);

  parts.push(String(product.quantity));
  parts.push(product.unitType);

  for (const synonym of product.synonyms) {
    parts.push(synonym);
  }

  return parts.join(" ");
}

export function searchProducts(input: SearchProductsInput): CanonicalProduct[] {
  const normalizedQuery = normalizeSearchText(input.query);
  if (normalizedQuery.length === 0) return input.products.slice();

  const terms = normalizedQuery.split(" ").filter((term) => term.length > 0);
  if (terms.length === 0) return input.products.slice();

  return input.products.filter((product) => {
    const haystack = normalizeSearchText(getProductSearchText(product));
    return terms.every((term) => haystack.includes(term));
  });
}
