import path from "node:path";

export const CATALOG_ROOT = path.resolve(process.cwd(), "scripts/catalog");

export const CATALOG_DATA_DIR = path.join(CATALOG_ROOT, "data");
export const DATA_DIRS = {
  mock: path.join(CATALOG_DATA_DIR, "mock"),
  cacheSearch: path.join(CATALOG_DATA_DIR, "cache/search"),
  cachePages: path.join(CATALOG_DATA_DIR, "cache/pages"),
  raw: path.join(CATALOG_DATA_DIR, "raw"),
  processed: path.join(CATALOG_DATA_DIR, "processed"),
  review: path.join(CATALOG_DATA_DIR, "review"),
  final: path.join(CATALOG_DATA_DIR, "final"),
} as const;

export const FILES = {
  mockTitles: path.join(DATA_DIRS.mock, "mock-titles.json"),
  processedCandidates: path.join(DATA_DIRS.processed, "product-candidates.json"),
  finalDraft: path.join(DATA_DIRS.final, "canonical-products.draft.json"),
  finalApproved: path.join(DATA_DIRS.final, "canonical-products.approved.json"),
  reviewCsv: path.join(DATA_DIRS.review, "canonical-review.csv"),
} as const;

