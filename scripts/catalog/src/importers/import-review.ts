import fs from "node:fs/promises";
import { FILES } from "../config/paths";
import { writeJson } from "../cache/fs";
import { parseCsv } from "../exporters/csv";
import { CanonicalProduct, PackageType, ReviewRow } from "../types/catalog";
import { generateCanonicalId } from "../normalizers/canonical-id";

function parseBoolCell(v: string): boolean {
  return ["1", "true", "yes", "sim", "y"].includes((v ?? "").trim().toLowerCase());
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const v of values) {
    const s = (v ?? "").trim();
    if (s.length > 0) return s;
  }
  return null;
}

function parseIntOrNull(v: string | null): number | null {
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function normalizeEnumCell(v: string | null): string | null {
  const s = (v ?? "").trim();
  return s.length > 0 ? s : null;
}

function parsePackageTypeCell(v: string | null): PackageType | null {
  const s = (v ?? "").trim();
  if (!s) return null;
  if (s === "pacote" || s === "kit" || s === "combo" || s === "refil" || s === "unknown") return s;
  return null;
}

export function reviewRowToCanonicalProduct(row: Record<string, string>): CanonicalProduct | null {
  const r = row as unknown as ReviewRow;
  if (!parseBoolCell(r.approved)) return null;

  const category = (r.category ?? "").trim();
  if (category !== "diaper" && category !== "wipe") return null;

  const brand = firstNonEmpty(r.corrected_brand, r.brand);
  const line = firstNonEmpty(r.corrected_line, r.line);
  const size = firstNonEmpty(r.corrected_size, r.size);
  const quantityTotal = parseIntOrNull(firstNonEmpty(r.corrected_quantity, r.quantity_total));
  const packCount = parseIntOrNull(firstNonEmpty(r.pack_count)) ?? 1;
  const quantityPerPack =
    parseIntOrNull(firstNonEmpty(r.quantity_per_pack)) ??
    (quantityTotal !== null ? Math.floor(quantityTotal / Math.max(1, packCount)) : null);

  if (!brand || !quantityTotal || !quantityPerPack) return null;

  const unitType = (r.unit_type ?? "").trim() === "lenco" ? "lenco" : "fralda";
  const diaperType = normalizeEnumCell(r.diaper_type);
  const usageType = normalizeEnumCell(r.usage_type);
  const wipeType = normalizeEnumCell(r.wipe_type);
  const packageType = parsePackageTypeCell(r.package_type);

  const id = generateCanonicalId({
    category,
    brand,
    line,
    size: category === "diaper" ? (size ?? null) : null,
    diaperType: category === "diaper" ? ((diaperType as CanonicalProduct["diaperType"]) ?? "unknown") : null,
    usageType: category === "diaper" ? ((usageType as CanonicalProduct["usageType"]) ?? "unknown") : null,
    wipeType: category === "wipe" ? ((wipeType as CanonicalProduct["wipeType"]) ?? "unknown") : null,
    packageType: packageType ?? "unknown",
    totalQuantity: quantityTotal,
    unitType,
  });

  const now = new Date().toISOString();
  const normalizedAttributes: Record<string, string | number | boolean | null> = {};
  if (category === "diaper") {
    normalizedAttributes.diaperType = diaperType ?? "unknown";
    normalizedAttributes.usageType = usageType ?? "unknown";
    normalizedAttributes.packageType = packageType ?? "unknown";
    normalizedAttributes.packCount = packCount;
    normalizedAttributes.quantityPerPack = quantityPerPack;
    normalizedAttributes.totalQuantity = quantityTotal;
  } else {
    normalizedAttributes.wipeType = wipeType ?? "unknown";
    normalizedAttributes.packageType = packageType ?? "unknown";
    normalizedAttributes.packCount = packCount;
    normalizedAttributes.quantityPerPack = quantityPerPack;
    normalizedAttributes.totalQuantity = quantityTotal;
  }

  return {
    id,
    category,
    brand,
    line,
    name: [
      brand,
      line,
      category === "diaper" ? size : null,
      category === "diaper" ? diaperType : wipeType,
      category === "diaper" ? usageType : packageType,
      `${quantityTotal}`,
    ]
      .filter(Boolean)
      .join(" "),
    size: category === "diaper" ? ((size as CanonicalProduct["size"]) ?? null) : null,
    diaperType: category === "diaper" ? ((diaperType as CanonicalProduct["diaperType"]) ?? "unknown") : null,
    usageType: category === "diaper" ? ((usageType as CanonicalProduct["usageType"]) ?? "unknown") : null,
    wipeType: category === "wipe" ? ((wipeType as CanonicalProduct["wipeType"]) ?? "unknown") : null,
    packageType: packageType ?? "unknown",
    packCount,
    quantityPerPack,
    quantity: quantityTotal,
    unitType,
    weightRange: null,
    eanGtin: null,
    imageReferenceUrl: null,
    synonyms: [],
    normalizedAttributes,
    status: "active",
    sourceConfidence: Number.parseFloat(r.confidence || "0") || 0,
    createdAt: now,
    updatedAt: now,
  };
}

export async function importReviewCsv() {
  const csv = await fs.readFile(FILES.reviewCsv, "utf8");
  const rows = parseCsv(csv);

  const approved = rows
    .map(reviewRowToCanonicalProduct)
    .filter((p): p is CanonicalProduct => p !== null);

  // Deduplicate by id (keep highest confidence)
  const byId = new Map<string, CanonicalProduct>();
  for (const p of approved) {
    const prev = byId.get(p.id);
    if (!prev || p.sourceConfidence > prev.sourceConfidence) byId.set(p.id, p);
  }

  const out = Array.from(byId.values()).sort((a, b) => b.sourceConfidence - a.sourceConfidence);
  await writeJson(FILES.finalApproved, out);
  return { path: FILES.finalApproved, approvedCount: out.length };
}

