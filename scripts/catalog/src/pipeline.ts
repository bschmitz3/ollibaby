import crypto from "node:crypto";
import { FILES } from "./config/paths";
import { readJson, writeJson } from "./cache/fs";
import { MockTitleRow } from "./types/mock";
import { CanonicalProduct, ProductCandidate } from "./types/catalog";
import { extractCandidateFromTitle } from "./extractors/extract-from-title";

function stableIdFromTitle(title: string, extra: string = ""): string {
  const h = crypto.createHash("sha256").update(`${title}::${extra}`).digest("hex").slice(0, 16);
  return `cand_${h}`;
}

function candidateToDraftCanonical(c: ProductCandidate): CanonicalProduct | null {
  if (!c.possibleCanonicalId) return null;
  if (!c.categoryExtracted || !c.brandExtracted || !c.totalQuantity || !c.unitTypeExtracted) return null;
  const now = new Date().toISOString();
  const packCount = c.packCount ?? 1;
  const quantityPerPack = c.quantityPerPack ?? c.totalQuantity;
  if (!quantityPerPack) return null;
  return {
    id: c.possibleCanonicalId,
    category: c.categoryExtracted,
    brand: c.brandExtracted,
    line: c.lineExtracted,
    name: [
      c.brandExtracted,
      c.lineExtracted,
      c.categoryExtracted === "diaper" ? c.sizeExtracted : null,
      c.categoryExtracted === "diaper" ? c.diaperType : c.wipeType,
      c.categoryExtracted === "diaper" ? c.usageType : null,
      `${c.totalQuantity}`,
      c.unitTypeExtracted,
    ]
      .filter(Boolean)
      .join(" "),
    size: c.categoryExtracted === "diaper" ? c.sizeExtracted : null,
    diaperType: c.categoryExtracted === "diaper" ? c.diaperType : null,
    usageType: c.categoryExtracted === "diaper" ? c.usageType : null,
    wipeType: c.categoryExtracted === "wipe" ? c.wipeType : null,
    packageType: c.packageType,
    packCount,
    quantityPerPack,
    quantity: c.totalQuantity,
    unitType: c.unitTypeExtracted,
    weightRange: null,
    eanGtin: null,
    imageReferenceUrl: null,
    synonyms: [],
    normalizedAttributes: {
      quantityPerPack: c.quantityPerPack,
      packCount: c.packCount,
    },
    status: c.status === "approved" ? "active" : "review",
    sourceConfidence: c.extractionConfidence,
    createdAt: now,
    updatedAt: now,
  };
}

export async function runMockPipeline() {
  const mockRows = await readJson<MockTitleRow[]>(FILES.mockTitles);

  const candidates: ProductCandidate[] = mockRows.map((r, idx) => {
    const id = stableIdFromTitle(r.title, r.url ?? `${idx}`);
    const { candidate } = extractCandidateFromTitle({
      id,
      title: r.title,
      url: r.url,
      retailer: r.retailer,
      sourceUrls: r.sourceUrls,
      source: "mock",
    });
    return candidate;
  });

  await writeJson(FILES.processedCandidates, candidates);

  // Draft canonicals: keep unique ids (best confidence)
  const byId = new Map<string, CanonicalProduct>();
  for (const c of candidates) {
    const draft = candidateToDraftCanonical(c);
    if (!draft) continue;
    const prev = byId.get(draft.id);
    if (!prev || draft.sourceConfidence > prev.sourceConfidence) byId.set(draft.id, draft);
  }
  const draftList = Array.from(byId.values()).sort((a, b) => b.sourceConfidence - a.sourceConfidence);
  await writeJson(FILES.finalDraft, draftList);

  const summary = {
    candidates: candidates.length,
    approved: candidates.filter((c) => c.status === "approved").length,
    needs_review: candidates.filter((c) => c.status === "needs_review").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
    draftCanonicals: draftList.length,
  };

  return summary;
}

