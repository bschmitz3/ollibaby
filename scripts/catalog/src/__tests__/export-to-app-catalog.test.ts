import { describe, expect, test } from "vitest";
import { renderAppCatalogTs } from "../exporters/export-to-app-catalog";
import type { CanonicalProduct } from "../types/catalog";

describe("export-to-app-catalog", () => {
  test("renders a TS module exporting canonicalProducts", () => {
    const products: CanonicalProduct[] = [
      {
        id: "x",
        category: "diaper",
        brand: "Pampers",
        line: "Confort Sec",
        name: "Pampers Confort Sec",
        size: "G",
        diaperType: "fita",
        usageType: "regular",
        wipeType: null,
        packageType: "pacote",
        packCount: 1,
        quantityPerPack: 96,
        quantity: 96,
        unitType: "fralda",
        weightRange: null,
        eanGtin: null,
        imageReferenceUrl: null,
        synonyms: [],
        normalizedAttributes: { diaperType: "fita", usageType: "regular", packageType: "pacote" },
        status: "active",
        sourceConfidence: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const ts = renderAppCatalogTs(products);

    expect(ts).toContain("export const canonicalProducts");
    expect(ts).toContain('as const satisfies readonly CanonicalProduct[]');
    expect(ts).toContain('"id": "x"');
  });
});

