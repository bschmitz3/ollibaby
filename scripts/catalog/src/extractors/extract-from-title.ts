import { ProductCandidate } from "../types/catalog";
import { detectCategory } from "../normalizers/category";
import { detectBrand } from "../normalizers/brand";
import { detectLine } from "../normalizers/line";
import { detectDiaperSize } from "../normalizers/size";
import { detectType } from "../normalizers/type";
import { inferDiaperTypeFromSignals } from "../normalizers/type";
import { extractQuantity } from "../normalizers/quantity";
import { inferUnitType } from "../normalizers/unit";
import { generateCanonicalId } from "../normalizers/canonical-id";
import { detectUsageType } from "../normalizers/usage";
import { detectPackageType } from "../normalizers/package";
import { detectWipeType } from "../normalizers/wipe-type";
import { AMBIGUOUS_KEYWORDS, OUT_OF_MVP_KEYWORDS } from "../seeds/rejection-keywords";
import { normalizeText } from "../normalizers/text";

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesKeyword(normalizedTitle: string, keyword: string): boolean {
  const k = normalizeText(keyword);
  // If keyword has spaces, do simple contains (phrase)
  if (k.includes(" ")) return normalizedTitle.includes(k);
  // Otherwise match whole word to avoid substring traps (e.g. "creme" vs "cremer")
  const re = new RegExp(`\\b${escapeRegExp(k)}\\b`, "i");
  return re.test(normalizedTitle);
}

export interface ExtractCandidateInput {
  id: string;
  title: string;
  url?: string;
  retailer?: string;
  sourceUrls?: string[];
  source: ProductCandidate["source"];
}

function computeConfidence(params: {
  category: boolean;
  brand: boolean;
  line: boolean;
  size: boolean;
  quantity: boolean;
  unit: boolean;
  retailerKnown: boolean;
  ambiguousSignals: boolean;
  outOfMvpSignals: boolean;
}): number {
  let score = 0;
  const add = (cond: boolean, points: number) => {
    if (cond) score += points;
  };

  add(params.category, 0.2);
  add(params.brand, 0.25);
  add(params.line, 0.1);
  add(params.size, 0.15);
  add(params.quantity, 0.2);
  add(params.unit, 0.05);
  add(params.retailerKnown, 0.05);

  if (params.ambiguousSignals) score -= 0.15;
  if (params.outOfMvpSignals) score -= 0.35;

  return Math.max(0, Math.min(1, Number(score.toFixed(3))));
}

function knownRetailer(retailer?: string): boolean {
  if (!retailer) return false;
  const r = normalizeText(retailer);
  return ["amazon", "mercado livre", "shopee", "magalu", "magazineluiza"].some((x) => r.includes(x));
}

export function extractCandidateFromTitle(input: ExtractCandidateInput): {
  candidate: ProductCandidate;
  warnings: string[];
} {
  const warnings: string[] = [];
  const t = normalizeText(input.title);

  const outOfMvpSignal = OUT_OF_MVP_KEYWORDS.some((k) => matchesKeyword(t, k));
  const ambiguousSignal = AMBIGUOUS_KEYWORDS.some((k) => t.includes(normalizeText(k)));

  const cat = detectCategory(input.title);
  if (cat.ambiguous) warnings.push(...cat.reasons);

  const brand = detectBrand(input.title, cat.category);
  if (brand.ambiguous) warnings.push("brand_ambiguous");

  const line = detectLine(input.title);
  if (line.ambiguous) warnings.push("line_ambiguous");

  const size = cat.category === "diaper" ? detectDiaperSize(input.title) : null;
  if (size?.ambiguous) warnings.push("size_ambiguous");

  const type = detectType(input.title);
  const inferredDiaperType =
    cat.category === "diaper"
      ? inferDiaperTypeFromSignals({
          titleRaw: input.title,
          line: line.line,
          detectedType: type.type,
        })
      : { inferred: "unknown", reason: null };

  const qty = extractQuantity(input.title);
  warnings.push(...qty.warnings);

  const unitType = inferUnitType(cat.category);
  const usage = cat.category === "diaper" ? detectUsageType(input.title) : { usageType: "unknown", signals: [] };
  const wipeType = cat.category === "wipe" ? detectWipeType(input.title) : { wipeType: "unknown", signals: [] };
  const pkg = detectPackageType({ titleRaw: input.title, packCount: qty.packCount });

  const hasCategory = cat.category !== null;
  const hasBrand = brand.brand !== null;
  const hasLine = line.line !== null && !line.ambiguous;
  const hasQuantity = qty.totalQuantity !== null && !qty.conflicting;
  const hasUnit = unitType !== null;
  const hasDiaperType = cat.category !== "diaper" ? true : inferredDiaperType.inferred !== "unknown";

  const confidence = computeConfidence({
    category: hasCategory,
    brand: hasBrand,
    line: hasLine,
    size: cat.category === "diaper" ? Boolean(size?.size) : true,
    quantity: hasQuantity,
    unit: hasUnit,
    retailerKnown: knownRetailer(input.retailer),
    ambiguousSignals:
      ambiguousSignal ||
      qty.conflicting ||
      Boolean(line.ambiguous) ||
      Boolean(size?.ambiguous) ||
      Boolean(brand.ambiguous) ||
      cat.ambiguous ||
      (cat.category === "wipe" && line.line === null) ||
      (cat.category === "diaper" && !hasDiaperType) ||
      (cat.category === "diaper" && usage.usageType === "unknown"),
    outOfMvpSignals: outOfMvpSignal,
  });

  const rejectionReasons: string[] = [];

  // Hard rejections (conservative)
  if (outOfMvpSignal) rejectionReasons.push("out_of_mvp");
  if (!hasCategory) rejectionReasons.push("no_category");
  if (!hasBrand) rejectionReasons.push("no_brand");
  if (qty.totalQuantity === null) rejectionReasons.push("no_quantity");
  if (cat.category === "diaper" && (size?.size ?? null) === null) rejectionReasons.push("diaper_missing_size");
  if (line.ambiguous) rejectionReasons.push("line_ambiguous");

  // Conservative “needs_review”
  const needsReviewReasons: string[] = [];
  if (cat.ambiguous) needsReviewReasons.push("category_ambiguous");
  if (brand.ambiguous) needsReviewReasons.push("brand_ambiguous");
  if (size?.ambiguous) needsReviewReasons.push("size_ambiguous");
  if (qty.conflicting) needsReviewReasons.push("quantity_conflicting");
  if (ambiguousSignal) needsReviewReasons.push("promo_or_ambiguous_terms");
  if (cat.category === "wipe" && line.line === null) needsReviewReasons.push("wipe_missing_line");
  if (cat.category === "diaper" && !hasDiaperType) needsReviewReasons.push("diaper_missing_diaper_type");
  if (cat.category === "diaper" && usage.usageType === "unknown") needsReviewReasons.push("diaper_missing_usage_type");

  let status: ProductCandidate["status"] = "needs_review";
  if (rejectionReasons.length > 0) status = "rejected";
  else if (confidence >= 0.9 && needsReviewReasons.length === 0) status = "approved";
  else status = "needs_review";

  const possibleCanonicalId =
    status !== "rejected" &&
    cat.category &&
    brand.brand &&
    qty.totalQuantity !== null &&
    unitType
      ? generateCanonicalId({
          category: cat.category,
          brand: brand.brand,
          line: line.line,
          size: cat.category === "diaper" ? (size?.size ?? null) : null,
          diaperType: cat.category === "diaper" ? inferredDiaperType.inferred : null,
          usageType: cat.category === "diaper" ? usage.usageType : null,
          wipeType: cat.category === "wipe" ? wipeType.wipeType : null,
          packageType: pkg.packageType,
          totalQuantity: qty.totalQuantity,
          unitType,
        })
      : null;

  const candidate: ProductCandidate = {
    id: input.id,
    titleRaw: input.title,
    url: input.url ?? null,
    retailer: input.retailer ?? null,
    source: input.source,
    categoryExtracted: cat.category,
    brandExtracted: brand.brand,
    lineExtracted: line.line,
    sizeExtracted: cat.category === "diaper" ? (size?.size ?? null) : null,
    diaperType: cat.category === "diaper" ? inferredDiaperType.inferred : null,
    usageType: cat.category === "diaper" ? usage.usageType : null,
    wipeType: cat.category === "wipe" ? wipeType.wipeType : null,
    packageType: pkg.packageType,
    quantityPerPack: qty.quantityPerPack,
    packCount: qty.packCount,
    totalQuantity: qty.totalQuantity,
    unitTypeExtracted: unitType,
    possibleCanonicalId,
    extractionConfidence: confidence,
    matchingConfidence: possibleCanonicalId ? confidence : 0,
    status,
    rejectionReasons: [...rejectionReasons, ...needsReviewReasons],
    sourceUrls: input.sourceUrls ?? (input.url ? [input.url] : []),
  };

  // Never auto-approve low confidence
  if (candidate.status === "approved" && candidate.extractionConfidence < 0.9) {
    candidate.status = "needs_review";
    candidate.rejectionReasons.push("low_confidence");
  }

  return { candidate, warnings };
}

