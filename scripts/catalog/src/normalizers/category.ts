import { CanonicalCategory } from "../types/catalog";
import { normalizeText } from "./text";

const DIAPER_HINTS = [
  "fralda",
  "fraldas",
  "pants",
  "calca",
  "calcao",
  "fita",
  "noturna",
  "piscina",
];

const WIPE_HINTS = ["lenco", "lencos", "umedecido", "umidecido", "toalhinha", "wipes"];

export function detectCategory(titleRaw: string): {
  category: CanonicalCategory | null;
  ambiguous: boolean;
  reasons: string[];
} {
  const t = normalizeText(titleRaw);
  const diaper = DIAPER_HINTS.some((h) => t.includes(h));
  const wipe = WIPE_HINTS.some((h) => t.includes(h));

  if (diaper && wipe) {
    return { category: null, ambiguous: true, reasons: ["title_matches_both_categories"] };
  }
  if (diaper) return { category: "diaper", ambiguous: false, reasons: [] };
  if (wipe) return { category: "wipe", ambiguous: false, reasons: [] };
  return { category: null, ambiguous: false, reasons: ["no_category_hints"] };
}

