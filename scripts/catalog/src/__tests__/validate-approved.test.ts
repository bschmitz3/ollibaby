import { describe, expect, test } from "vitest";
import { validateApprovedProducts } from "../validators/validate-approved";

describe("validate-approved", () => {
  test("fails when input is not an array", () => {
    const r = validateApprovedProducts({ hello: "world" });
    expect(r.errorsCount).toBeGreaterThan(0);
    expect(r.errors).toContain("approved_json_not_array");
  });

  test("detects duplicates and missing fields", () => {
    const r = validateApprovedProducts([
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
      {
        id: "x",
        category: "wipe",
        brand: "",
        line: null,
        name: "Lenço qualquer",
        size: null,
        diaperType: null,
        usageType: null,
        wipeType: "regular",
        packageType: null,
        packCount: 1,
        quantityPerPack: 96,
        quantity: 0,
        unitType: "lenco",
        weightRange: null,
        eanGtin: null,
        imageReferenceUrl: null,
        synonyms: [],
        normalizedAttributes: {},
        status: "review",
        sourceConfidence: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(r.errors).toContain("duplicate_id:x");
    expect(r.errors).toContain("product_1_missing_brand");
    expect(r.errors).toContain("product_1_invalid_quantity");
    expect(r.errors).toContain("product_1_non_active_status:review");
    expect(r.errors).toContain("product_1_missing_normalizedAttributes.packageType");
  });
});

