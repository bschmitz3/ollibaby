import { normalizeText } from "./text";

export interface QuantityExtraction {
  quantityPerPack: number | null;
  packCount: number | null;
  totalQuantity: number | null;
  explicitTotalQuantity: number | null;
  conflicting: boolean;
  warnings: string[];
}

function toInt(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function findAllQuantities(t: string): number[] {
  const matches = Array.from(
    t.matchAll(/\b(\d{1,4})\s*(un|unid|unidade|unidades|und|fraldas|fralda|lencos|lenco|lenços|lenço)\b/gi),
  );
  return matches.map((m) => toInt(m[1] ?? "")).filter((n): n is number => n !== null);
}

function findPackCountAndPerPackHint(
  t: string,
): { packCount: number | null; perPackHint: number | null } {
  // Handles:
  // - "kit ... 4 pacotes 96" (even without "unidades")
  // - "6 pacotes de 96"
  // - "com 4 pacotes de 48"
  const m = Array.from(t.matchAll(/\b(\d{1,2})\s*(pacotes|packs|pcts|pacote)\b/gi))[0];
  if (!m?.[1]) return { packCount: null, perPackHint: null };

  const packCount = toInt(m[1]) ?? null;
  const rest = t.slice((m.index ?? 0) + (m[0]?.length ?? 0));
  const m2 = rest.match(/^\s*(?:de\s*)?(\d{1,4})\b/i);
  const perPackHint = m2?.[1] ? (toInt(m2[1]) ?? null) : null;

  return { packCount, perPackHint };
}

function parseNxM(t: string): { a: number; b: number } | null {
  const m = t.match(/\b(\d{1,2})\s*x\s*(\d{1,4})\b/i);
  if (!m?.[1] || !m?.[2]) return null;
  const a = toInt(m[1]);
  const b = toInt(m[2]);
  if (!a || !b) return null;
  return { a, b };
}

export function extractQuantity(titleRaw: string): QuantityExtraction {
  const t = normalizeText(titleRaw);
  const warnings: string[] = [];

  const quantities = findAllQuantities(t);
  const explicitTotalQuantity = quantities.length >= 1 ? quantities[0]! : null;
  const { packCount: packCountFromWords, perPackHint } = findPackCountAndPerPackHint(t);

  let quantityPerPack: number | null = null;
  let packCount: number | null = packCountFromWords;

  // Rule: “80 unidades” -> perPack=80, packCount=1
  if (quantities.length === 1 && !packCount) {
    quantityPerPack = quantities[0]!;
    packCount = 1;
  }

  // Rule: “kit 4 pacotes 96 unidades” -> perPack=96, packCount=4
  if (packCount && quantityPerPack === null && perPackHint !== null) {
    quantityPerPack = perPackHint;
  }

  if (quantities.length >= 1 && packCount && quantityPerPack === null) {
    // Prefer a number right after "pacotes" (may omit "unidades")
    quantityPerPack = perPackHint ?? (quantities[quantities.length - 1] ?? null);
  }

  // Pattern: “4x96” or “96x4”
  if (quantityPerPack === null || packCount === null) {
    const nxm = parseNxM(t);
    if (nxm) {
      const looksLikePackCount = nxm.a <= 12 && nxm.b >= 20;
      const looksLikeInverse = nxm.b <= 12 && nxm.a >= 20;
      if (looksLikePackCount) {
        packCount ??= nxm.a;
        quantityPerPack ??= nxm.b;
      } else if (looksLikeInverse) {
        packCount ??= nxm.b;
        quantityPerPack ??= nxm.a;
      } else {
        warnings.push("nxm_ambiguous");
      }
    }
  }

  // If we already set a "simple total" (e.g. 384 unidades) but also have NxM (4x96),
  // prefer NxM decomposition when it matches the explicit total.
  if (packCount === 1 && quantityPerPack !== null) {
    const nxm = parseNxM(t);
    if (nxm && explicitTotalQuantity !== null) {
      const candidates: Array<{ packCount: number; perPack: number }> = [];
      if (nxm.a <= 12 && nxm.b >= 20) candidates.push({ packCount: nxm.a, perPack: nxm.b });
      if (nxm.b <= 12 && nxm.a >= 20) candidates.push({ packCount: nxm.b, perPack: nxm.a });

      const match = candidates.find((c) => c.packCount * c.perPack === explicitTotalQuantity);
      if (match) {
        packCount = match.packCount;
        quantityPerPack = match.perPack;
      }
    }
  }

  // Conflicting quantities: two different explicit "unidades" numbers and no clear kit structure
  const uniqueQuantities = Array.from(new Set(quantities));
  const conflicting = uniqueQuantities.length >= 2 && !packCountFromWords;
  if (conflicting) warnings.push("conflicting_quantities");

  // Conservative fallback:
  // if we saw multiple different quantities but can't safely infer pack math,
  // keep a provisional "per pack" (first occurrence) and mark as conflicting.
  if (conflicting && quantityPerPack === null && uniqueQuantities.length > 0) {
    quantityPerPack = uniqueQuantities[0] ?? null;
    packCount ??= 1;
  }

  const computedTotal =
    quantityPerPack !== null && packCount !== null ? quantityPerPack * packCount : null;

  // If we detected a kit (packCount>1), a single explicit "96 unidades" is usually per-pack.
  const explicitLooksLikePerPack =
    packCount !== null &&
    packCount > 1 &&
    explicitTotalQuantity !== null &&
    quantityPerPack !== null &&
    explicitTotalQuantity === quantityPerPack;

  const mismatch =
    explicitTotalQuantity !== null &&
    computedTotal !== null &&
    explicitTotalQuantity !== computedTotal &&
    !(packCount === 1 && explicitTotalQuantity === quantityPerPack) &&
    !explicitLooksLikePerPack;

  if (mismatch) warnings.push("total_mismatch");

  const totalQuantity = computedTotal ?? explicitTotalQuantity;

  return {
    quantityPerPack,
    packCount,
    totalQuantity,
    explicitTotalQuantity,
    conflicting: conflicting || mismatch,
    warnings,
  };
}

