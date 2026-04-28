export type ProductCategory = "diaper" | "wet_wipe";

export type UnitType = "diaper" | "wipe";

export type DiaperSize = "RN" | "P" | "M" | "G" | "XG" | "XXG" | "XXXG";

export type CanonicalProductStatus = "active" | "review" | "discontinued";

export type CanonicalProduct = {
  id: string;
  category: ProductCategory;
  brand: string;
  line: string;
  name: string;
  /**
   * Diapers will usually be one of `DiaperSize`, but we keep `string`
   * for edge cases (e.g. "G c/ ajuste", "Tamanho 4") until catalog rules mature.
   */
  size?: DiaperSize | string;
  type?: string;
  weightRange?: string;
  quantity: number;
  unitType: UnitType;
  /** EAN/GTIN as digits, may include leading zeros. */
  eanGtin?: string;
  imageUrl?: string;
  synonyms: string[];
  status: CanonicalProductStatus;
  /** ISO-8601 datetime string. */
  createdAt: string;
  /** ISO-8601 datetime string. */
  updatedAt: string;
};
