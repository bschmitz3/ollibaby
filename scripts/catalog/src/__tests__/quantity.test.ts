import { describe, expect, test } from "vitest";
import { extractQuantity } from "../normalizers/quantity";

describe("quantity extraction", () => {
  test("simple quantity: '80 unidades' -> perPack=80, packCount=1, total=80", () => {
    const q = extractQuantity("Lenços Umedecidos Pampers 80 unidades");
    expect(q.quantityPerPack).toBe(80);
    expect(q.packCount).toBe(1);
    expect(q.totalQuantity).toBe(80);
    expect(q.conflicting).toBe(false);
  });

  test("kit: 'kit 4 pacotes 96 unidades' -> perPack=96, packCount=4, total=384", () => {
    const q = extractQuantity("Kit 4 pacotes 96 unidades Lenços Umedecidos Huggies");
    expect(q.quantityPerPack).toBe(96);
    expect(q.packCount).toBe(4);
    expect(q.totalQuantity).toBe(384);
    expect(q.conflicting).toBe(false);
  });

  test("phrasing: 'com 4 pacotes de 48 lenços' -> total=192", () => {
    const q = extractQuantity("com 4 pacotes de 48 lenços umedecidos");
    expect(q.quantityPerPack).toBe(48);
    expect(q.packCount).toBe(4);
    expect(q.totalQuantity).toBe(192);
  });

  test("4x48 = 192", () => {
    const q = extractQuantity("Kit lenços 4x48 unidades");
    expect(q.quantityPerPack).toBe(48);
    expect(q.packCount).toBe(4);
    expect(q.totalQuantity).toBe(192);
  });

  test("6x96 = 576", () => {
    const q = extractQuantity("Lenços umedecidos 6x96");
    expect(q.quantityPerPack).toBe(96);
    expect(q.packCount).toBe(6);
    expect(q.totalQuantity).toBe(576);
  });

  test("kit 4 pacotes de 96 = 384 (even without 'unidades')", () => {
    const q = extractQuantity("kit promocional 4 pacotes de 96");
    expect(q.quantityPerPack).toBe(96);
    expect(q.packCount).toBe(4);
    expect(q.totalQuantity).toBe(384);
  });

  test("conflicting quantities -> conflicting=true", () => {
    const q = extractQuantity("Fralda Huggies Supreme Care M 60 unidades + 100 unidades");
    expect(q.conflicting).toBe(true);
  });
});

