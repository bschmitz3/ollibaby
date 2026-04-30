import { FILES } from "../config/paths";
import { readJson, writeText } from "../cache/fs";
import { ProductCandidate, ReviewRow } from "../types/catalog";
import { toCsv } from "./csv";
import crypto from "node:crypto";
import { normalizeText, slugifyStable } from "../normalizers/text";

export const REVIEW_HEADERS: Array<keyof ReviewRow> = [
  "suggested_id",
  "category",
  "brand",
  "line",
  "size",
  "diaper_type",
  "usage_type",
  "wipe_type",
  "package_type",
  "pack_count",
  "quantity_per_pack",
  "quantity_total",
  "unit_type",
  "confidence",
  "source_urls",
  "status",
  "rejection_reasons",
  "review_notes",
  "corrected_brand",
  "corrected_line",
  "corrected_size",
  "corrected_quantity",
  "approved",
];

function candidateToReviewRow(c: ProductCandidate): Record<string, string> {
  const suggestedId = ensureSuggestedId(c);
  return {
    suggested_id: suggestedId,
    category: c.categoryExtracted ?? "",
    brand: c.brandExtracted ?? "",
    line: c.lineExtracted ?? "",
    size: c.sizeExtracted ?? "",
    diaper_type: c.diaperType ?? "",
    usage_type: c.usageType ?? "",
    wipe_type: c.wipeType ?? "",
    package_type: c.packageType ?? "",
    pack_count: c.packCount !== null ? String(c.packCount) : "",
    quantity_per_pack: c.quantityPerPack !== null ? String(c.quantityPerPack) : "",
    quantity_total: c.totalQuantity !== null ? String(c.totalQuantity) : "",
    unit_type: c.unitTypeExtracted ?? "",
    confidence: String(c.extractionConfidence),
    source_urls: c.sourceUrls.join(" "),
    status: c.status,
    rejection_reasons: c.rejectionReasons.join(";"),
    review_notes: "",
    corrected_brand: "",
    corrected_line: "",
    corrected_size: "",
    corrected_quantity: "",
    approved: "",
  };
}

export function ensureSuggestedId(candidate: ProductCandidate): string {
  if (candidate.possibleCanonicalId && candidate.possibleCanonicalId.trim().length > 0) {
    return candidate.possibleCanonicalId;
  }

  const normalizedBrand = candidate.brandExtracted
    ? slugifyStable(candidate.brandExtracted)
    : "unknown";
  const titleNorm = normalizeText(candidate.titleRaw || "");
  const shortHash = crypto.createHash("sha256").update(titleNorm).digest("hex").slice(0, 10);
  return `rejected-${normalizedBrand}-${shortHash}`;
}

export function groupCandidatesForReview(candidates: ProductCandidate[]): ProductCandidate[] {
  // Include rejected as well for human audit.
  // Note: rejected often won't have possibleCanonicalId; we still export them as individual rows.
  const withSuggestedId = candidates.filter((c) => c.possibleCanonicalId);
  const rejectedNoId = candidates.filter((c) => c.status === "rejected" && !c.possibleCanonicalId);

  const grouped = new Map<string, ProductCandidate[]>();
  for (const c of withSuggestedId) {
    const key = c.possibleCanonicalId!;
    const arr = grouped.get(key) ?? [];
    arr.push(c);
    grouped.set(key, arr);
  }

  const groupedRows = Array.from(grouped.entries()).map(([suggestedId, group]) => {
    const base = [...group].sort((a, b) => b.extractionConfidence - a.extractionConfidence)[0]!;
    const allUrls = Array.from(
      new Set(group.flatMap((g) => g.sourceUrls).filter((u) => u && u.trim().length > 0)),
    );

    // If any rejected exists in the group, keep it rejected.
    // Otherwise if any needs_review exists, keep needs_review.
    // Else approved.
    const status: ProductCandidate["status"] = group.some((g) => g.status === "rejected")
      ? "rejected"
      : group.some((g) => g.status === "needs_review") || base.status === "needs_review"
        ? "needs_review"
        : "approved";

    const rejectionReasons = Array.from(new Set(group.flatMap((g) => g.rejectionReasons)));

    return {
      ...base,
      possibleCanonicalId: suggestedId,
      sourceUrls: allUrls,
      status,
      rejectionReasons,
    };
  });

  // Rejected rows without suggested_id: keep as-is (one per candidate)
  return [...groupedRows, ...rejectedNoId];
}

export async function exportReviewCsv() {
  const candidates = await readJson<ProductCandidate[]>(FILES.processedCandidates);
  const rows = groupCandidatesForReview(candidates)
    .map(candidateToReviewRow)
    .sort((a, b) => Number.parseFloat(b.confidence) - Number.parseFloat(a.confidence));

  const csv = toCsv(rows, REVIEW_HEADERS as unknown as string[]);
  await writeText(FILES.reviewCsv, csv);
  return { path: FILES.reviewCsv, rowCount: rows.length };
}

