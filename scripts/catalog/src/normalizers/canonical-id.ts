import { CanonicalCategory, DiaperType, PackageType, UsageType, WipeType } from "../types/catalog";
import { slugifyStable } from "./text";

export interface CanonicalIdParts {
  category: CanonicalCategory;
  brand: string;
  line: string | null;
  size: string | null;
  diaperType: DiaperType | null;
  usageType: UsageType | null;
  wipeType: WipeType | null;
  packageType: PackageType | null;
  totalQuantity: number;
  unitType: "fralda" | "lenco";
}

export function generateCanonicalId(parts: CanonicalIdParts): string {
  const typeKey =
    parts.category === "diaper"
      ? `${parts.diaperType ?? "unknown"}+${parts.usageType ?? "unknown"}`
      : `${parts.wipeType ?? "unknown"}+${parts.packageType ?? "unknown"}`;
  const raw = [
    parts.category,
    parts.brand,
    parts.line ?? "no-line",
    parts.size ?? "no-size",
    typeKey,
    `${parts.totalQuantity}`,
    parts.unitType,
  ].join("|");
  return slugifyStable(raw);
}

