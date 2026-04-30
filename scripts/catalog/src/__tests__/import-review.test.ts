import { describe, expect, test } from "vitest";
import { reviewRowToCanonicalProduct } from "../importers/import-review";

describe("import review CSV", () => {
  test("diaper approved preserves diaper_type and usage_type in normalizedAttributes", () => {
    const p = reviewRowToCanonicalProduct({
      suggested_id: "whatever",
      category: "diaper",
      brand: "Pampers",
      line: "Confort Sec",
      size: "M",
      diaper_type: "fita",
      usage_type: "regular",
      wipe_type: "",
      package_type: "pacote",
      pack_count: "1",
      quantity_per_pack: "60",
      quantity_total: "60",
      unit_type: "fralda",
      confidence: "0.9",
      source_urls: "",
      status: "needs_review",
      rejection_reasons: "",
      review_notes: "",
      corrected_brand: "Pampers",
      corrected_line: "Confort Sec",
      corrected_size: "G",
      corrected_quantity: "52",
      approved: "true",
    });

    expect(p).not.toBeNull();
    expect(p?.brand).toBe("Pampers");
    expect(p?.line).toBe("Confort Sec");
    expect(p?.size).toBe("G");
    expect(p?.quantity).toBe(52);
    expect(p?.normalizedAttributes.diaperType).toBe("fita");
    expect(p?.normalizedAttributes.usageType).toBe("regular");
    expect(p?.normalizedAttributes.packageType).toBe("pacote");
  });

  test("diaper pants with diaper_type=pants", () => {
    const p = reviewRowToCanonicalProduct({
      suggested_id: "x",
      category: "diaper",
      brand: "Pampers",
      line: "Pants",
      size: "G",
      diaper_type: "pants",
      usage_type: "regular",
      wipe_type: "",
      package_type: "pacote",
      pack_count: "1",
      quantity_per_pack: "60",
      quantity_total: "60",
      unit_type: "fralda",
      confidence: "0.95",
      source_urls: "",
      status: "approved",
      rejection_reasons: "",
      review_notes: "",
      corrected_brand: "",
      corrected_line: "",
      corrected_size: "",
      corrected_quantity: "",
      approved: "true",
    });
    expect(p?.normalizedAttributes.diaperType).toBe("pants");
  });

  test("wipe approved preserves package_type=kit", () => {
    const p = reviewRowToCanonicalProduct({
      suggested_id: "y",
      category: "wipe",
      brand: "Huggies",
      line: "",
      size: "",
      diaper_type: "",
      usage_type: "",
      wipe_type: "regular",
      package_type: "kit",
      pack_count: "4",
      quantity_per_pack: "96",
      quantity_total: "384",
      unit_type: "lenco",
      confidence: "0.9",
      source_urls: "",
      status: "needs_review",
      rejection_reasons: "",
      review_notes: "",
      corrected_brand: "",
      corrected_line: "",
      corrected_size: "",
      corrected_quantity: "",
      approved: "true",
    });
    expect(p?.normalizedAttributes.packageType).toBe("kit");
    expect(p?.normalizedAttributes.packCount).toBe(4);
    expect(p?.normalizedAttributes.quantityPerPack).toBe(96);
    expect(p?.normalizedAttributes.totalQuantity).toBe(384);
  });

  test("corrected_quantity overwrites quantity_total", () => {
    const p = reviewRowToCanonicalProduct({
      suggested_id: "z",
      category: "wipe",
      brand: "Pampers",
      line: "",
      size: "",
      diaper_type: "",
      usage_type: "",
      wipe_type: "regular",
      package_type: "pacote",
      pack_count: "1",
      quantity_per_pack: "100",
      quantity_total: "100",
      unit_type: "lenco",
      confidence: "0.9",
      source_urls: "",
      status: "approved",
      rejection_reasons: "",
      review_notes: "",
      corrected_brand: "",
      corrected_line: "",
      corrected_size: "",
      corrected_quantity: "96",
      approved: "true",
    });
    expect(p?.quantity).toBe(96);
    expect(p?.normalizedAttributes.totalQuantity).toBe(96);
  });
});

