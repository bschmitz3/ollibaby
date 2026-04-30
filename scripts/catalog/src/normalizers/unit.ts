import { CanonicalCategory } from "../types/catalog";

export function inferUnitType(category: CanonicalCategory | null): "fralda" | "lenco" | null {
  if (category === "diaper") return "fralda";
  if (category === "wipe") return "lenco";
  return null;
}

