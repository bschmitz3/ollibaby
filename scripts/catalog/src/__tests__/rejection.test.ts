import { describe, expect, test } from "vitest";
import { extractCandidateFromTitle } from "../extractors/extract-from-title";

describe("rejection / needs_review", () => {
  test("reject product outside MVP (pomada)", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "1",
      title: "Pomada Bepantol Baby 30g",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.status).toBe("rejected");
    expect(candidate.rejectionReasons).toContain("out_of_mvp");
  });

  test("reject diaper without size", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "2",
      title: "Fralda Pampers Confort Sec 60 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.status).toBe("rejected");
    expect(candidate.rejectionReasons).toContain("diaper_missing_size");
  });

  test("needs_review for ambiguous promo without clear quantity", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "3",
      title: "Fralda Pampers Confort Sec - leve 6 pague 5 (ver descrição)",
      retailer: "Amazon",
      source: "mock",
    });
    // may be rejected due to missing quantity; either way must not be approved
    expect(candidate.status).not.toBe("approved");
  });

  test("reject when line is too ambiguous", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "4",
      title: "Fralda Huggies Supreme Care Tripla Proteção M 60 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.status).toBe("rejected");
    expect(candidate.rejectionReasons).toContain("line_ambiguous");
  });

  test("quantity conflicting stays needs_review (not rejected)", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "5",
      title: "Fralda Huggies Supreme Care M 60 unidades + 100 unidades",
      retailer: "Mercado Livre",
      source: "mock",
    });
    expect(candidate.status).toBe("needs_review");
    expect(candidate.rejectionReasons).toContain("quantity_conflicting");
  });

  test("wipe without line becomes needs_review", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "6",
      title: "Lenços Umedecidos Pampers 96 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("wipe");
    expect(candidate.lineExtracted).toBeNull();
    expect(candidate.status).toBe("needs_review");
    expect(candidate.rejectionReasons).toContain("wipe_missing_line");
  });

  test("diaper without inferable diaperType becomes needs_review", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "7",
      title: "Fralda Cremer G 52 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("diaper");
    expect(candidate.diaperType).toBe("unknown");
    expect(candidate.status).toBe("needs_review");
    expect(candidate.rejectionReasons).toContain("diaper_missing_diaper_type");
  });

  test("confidence < 0.90 is not auto-approved", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "8",
      title: "Fralda Needs Premium M 60 unidades",
      retailer: "Panvel",
      source: "mock",
    });
    expect(candidate.extractionConfidence).toBeLessThan(0.9);
    expect(candidate.status).not.toBe("approved");
  });
});

