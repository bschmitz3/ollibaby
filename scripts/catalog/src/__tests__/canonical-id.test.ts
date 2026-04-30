import { describe, expect, test } from "vitest";
import { generateCanonicalId } from "../normalizers/canonical-id";

describe("canonical id", () => {
  test("stable canonical_id for same parts", () => {
    const a = generateCanonicalId({
      category: "diaper",
      brand: "Pampers",
      line: "Confort Sec",
      size: "M",
      diaperType: "fita",
      usageType: "regular",
      wipeType: null,
      packageType: "pacote",
      totalQuantity: 60,
      unitType: "fralda",
    });
    const b = generateCanonicalId({
      category: "diaper",
      brand: "Pampers",
      line: "Confort Sec",
      size: "M",
      diaperType: "fita",
      usageType: "regular",
      wipeType: null,
      packageType: "pacote",
      totalQuantity: 60,
      unitType: "fralda",
    });
    expect(a).toBe(b);
  });
});

