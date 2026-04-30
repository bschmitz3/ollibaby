import { describe, expect, test } from "vitest";
import { groupCandidatesForReview, ensureSuggestedId } from "../exporters/export-review";

describe("export grouping behavior", () => {
  test("duplicate suggested_id groups and merges source_urls", () => {
    const grouped = groupCandidatesForReview([
      {
        id: "c1",
        titleRaw: "t1",
        url: "u1",
        retailer: "Amazon",
        source: "mock",
        categoryExtracted: "wipe",
        brandExtracted: "Pampers",
        lineExtracted: null,
        sizeExtracted: null,
        typeExtracted: "kit",
        quantityPerPack: 48,
        packCount: 4,
        totalQuantity: 192,
        unitTypeExtracted: "lenco",
        possibleCanonicalId: "wipe-pampers-no-line-no-size-kit-192-lenco",
        extractionConfidence: 0.91,
        matchingConfidence: 0.91,
        status: "needs_review",
        rejectionReasons: ["wipe_missing_line"],
        sourceUrls: ["u1"],
      },
      {
        id: "c2",
        titleRaw: "t2",
        url: "u2",
        retailer: "Shopee",
        source: "mock",
        categoryExtracted: "wipe",
        brandExtracted: "Pampers",
        lineExtracted: null,
        sizeExtracted: null,
        typeExtracted: "kit",
        quantityPerPack: 48,
        packCount: 4,
        totalQuantity: 192,
        unitTypeExtracted: "lenco",
        possibleCanonicalId: "wipe-pampers-no-line-no-size-kit-192-lenco",
        extractionConfidence: 0.9,
        matchingConfidence: 0.9,
        status: "needs_review",
        rejectionReasons: ["wipe_missing_line"],
        sourceUrls: ["u2"],
      },
    ]);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.sourceUrls.sort()).toEqual(["u1", "u2"]);
  });

  test("rejected candidates without suggested_id are still exported", () => {
    const grouped = groupCandidatesForReview([
      {
        id: "r1",
        titleRaw: "Pomada Bepantol Baby 30g",
        url: "u1",
        retailer: "Amazon",
        source: "mock",
        categoryExtracted: null,
        brandExtracted: null,
        lineExtracted: null,
        sizeExtracted: null,
        typeExtracted: null,
        quantityPerPack: null,
        packCount: null,
        totalQuantity: null,
        unitTypeExtracted: null,
        possibleCanonicalId: null,
        extractionConfidence: 0.1,
        matchingConfidence: 0,
        status: "rejected",
        rejectionReasons: ["out_of_mvp"],
        sourceUrls: ["u1"],
      },
    ]);
    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.status).toBe("rejected");
    expect(grouped[0]?.possibleCanonicalId).toBeNull();
  });

  test("fallback suggested_id for rejected is deterministic and never empty", () => {
    const candidate = {
      id: "r1",
      titleRaw: "Pomada Bepantol Baby 30g",
      url: "u1",
      retailer: "Amazon",
      source: "mock",
      categoryExtracted: null,
      brandExtracted: "Bepantol Baby",
      lineExtracted: null,
      sizeExtracted: null,
      typeExtracted: null,
      quantityPerPack: null,
      packCount: null,
      totalQuantity: null,
      unitTypeExtracted: null,
      possibleCanonicalId: null,
      extractionConfidence: 0.1,
      matchingConfidence: 0,
      status: "rejected" as const,
      rejectionReasons: ["out_of_mvp"],
      sourceUrls: ["u1"],
    };

    const a = ensureSuggestedId(candidate);
    const b = ensureSuggestedId(candidate);
    expect(a).toBe(b);
    expect(a).toMatch(/^rejected-bepantol-baby-[a-f0-9]{10}$/);
  });

  test("no exported candidate yields empty suggested_id", () => {
    const candidates = groupCandidatesForReview([
      {
        id: "r1",
        titleRaw: "Fórmula Infantil NAN 800g",
        url: "u1",
        retailer: "Amazon",
        source: "mock",
        categoryExtracted: null,
        brandExtracted: null,
        lineExtracted: null,
        sizeExtracted: null,
        typeExtracted: null,
        quantityPerPack: null,
        packCount: null,
        totalQuantity: null,
        unitTypeExtracted: null,
        possibleCanonicalId: null,
        extractionConfidence: 0,
        matchingConfidence: 0,
        status: "rejected",
        rejectionReasons: ["out_of_mvp"],
        sourceUrls: ["u1"],
      },
    ]);

    for (const c of candidates) {
      const id = ensureSuggestedId(c);
      expect(id.trim().length).toBeGreaterThan(0);
    }
  });
});

