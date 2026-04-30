import { describe, expect, test } from "vitest";
import { extractCandidateFromTitle } from "../extractors/extract-from-title";

describe("type modeling (diaper/wipe/package)", () => {
  test("Fralda Pampers Confort Sec G 96 unidades -> diaperType=fita, packageType=pacote, packCount=1", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "a",
      title: "Fralda Pampers Confort Sec G 96 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("diaper");
    expect(candidate.diaperType).toBe("fita");
    expect(candidate.packageType).toBe("pacote");
    expect(candidate.packCount).toBe(1);
    expect(candidate.totalQuantity).toBe(96);
  });

  test("Fralda Pampers Pants G 60 unidades -> diaperType=pants, packageType=pacote", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "b",
      title: "Fralda Pampers Pants G 60 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("diaper");
    expect(candidate.diaperType).toBe("pants");
    expect(candidate.packageType).toBe("pacote");
  });

  test("Fralda noturna Huggies Supreme Care G 48 unidades -> usageType=noturna", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "c",
      title: "Fralda noturna Huggies Supreme Care G 48 unidades",
      retailer: "Amazon",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("diaper");
    expect(candidate.usageType).toBe("noturna");
  });

  test("Kit 4 pacotes Lenço Huggies 96 unidades -> packageType=kit, packCount=4, perPack=96, total=384", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "d",
      title: "Kit 4 pacotes Lenço Huggies 96 unidades",
      retailer: "Mercado Livre",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("wipe");
    expect(candidate.packageType).toBe("kit");
    expect(candidate.packCount).toBe(4);
    expect(candidate.quantityPerPack).toBe(96);
    expect(candidate.totalQuantity).toBe(384);
  });

  test("Lenço Pampers 384 unidades em 4x96 -> packageType=kit", () => {
    const { candidate } = extractCandidateFromTitle({
      id: "e",
      title: "Lenço Pampers 384 unidades 4x96",
      retailer: "Shopee",
      source: "mock",
    });
    expect(candidate.categoryExtracted).toBe("wipe");
    expect(candidate.packageType).toBe("kit");
    expect(candidate.totalQuantity).toBe(384);
  });

  test("diaperType / wipeType never equal kit/pacote", () => {
    const diaper = extractCandidateFromTitle({
      id: "f",
      title: "Kit 2 pacotes Fralda Pampers Confort Sec M 60 unidades",
      retailer: "Mercado Livre",
      source: "mock",
    }).candidate;

    const wipe = extractCandidateFromTitle({
      id: "g",
      title: "Kit 4 pacotes Lenços Umedecidos Huggies 48 unidades",
      retailer: "Shopee",
      source: "mock",
    }).candidate;

    expect(["kit", "pacote"]).not.toContain(diaper.diaperType);
    expect(["kit", "pacote"]).not.toContain(wipe.wipeType);
  });
});

