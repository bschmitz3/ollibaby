import { CanonicalCategory } from "../types/catalog";
import { ALL_BRANDS_BY_CATEGORY } from "../seeds/brands";
import { normalizeText, stripAccents } from "./text";

function normalizeBrandForMatch(brand: string): string {
  return normalizeText(stripAccents(brand));
}

export function detectBrand(
  titleRaw: string,
  category: CanonicalCategory | null,
): { brand: string | null; ambiguous: boolean; matches: string[] } {
  const t = normalizeText(titleRaw);
  const brands = category ? ALL_BRANDS_BY_CATEGORY[category] : [...ALL_BRANDS_BY_CATEGORY.diaper, ...ALL_BRANDS_BY_CATEGORY.wipe];
  const matches = brands.filter((b) => t.includes(normalizeBrandForMatch(b)));

  const unique = Array.from(new Set(matches));
  if (unique.length === 0) return { brand: null, ambiguous: false, matches: [] };
  if (unique.length === 1) return { brand: unique[0]!, ambiguous: false, matches: unique };
  return { brand: null, ambiguous: true, matches: unique };
}

