export type CanonicalCategory = "diaper" | "wipe";

export type CanonicalStatus = "active" | "review" | "discontinued";
export type CandidateStatus = "approved" | "needs_review" | "rejected";

export type DiaperType = "fita" | "pants" | "unknown";
export type UsageType = "regular" | "noturna" | "piscina" | "unknown";
export type PackageType = "pacote" | "kit" | "combo" | "refil" | "unknown";
export type WipeType = "regular" | "sensitive" | "recem_nascido" | "unknown";

export interface CanonicalProduct {
  id: string;
  category: CanonicalCategory;
  brand: string;
  line: string | null;
  name: string;
  size: "RN" | "P" | "M" | "G" | "XG" | "XXG" | null;
  diaperType: DiaperType | null;
  usageType: UsageType | null;
  wipeType: WipeType | null;
  packageType: PackageType | null;
  packCount: number;
  quantityPerPack: number;
  quantity: number; // totalQuantity
  unitType: "fralda" | "lenco";
  weightRange: string | null;
  eanGtin: string | null;
  imageReferenceUrl: string | null;
  synonyms: string[];
  normalizedAttributes: Record<string, string | number | boolean | null>;
  status: CanonicalStatus;
  sourceConfidence: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCandidate {
  id: string;
  titleRaw: string;
  url: string | null;
  retailer: string | null;
  source: "mock" | "discover" | "crawl" | "import";
  categoryExtracted: CanonicalCategory | null;
  brandExtracted: string | null;
  lineExtracted: string | null;
  sizeExtracted: "RN" | "P" | "M" | "G" | "XG" | "XXG" | null;
  diaperType: DiaperType | null;
  usageType: UsageType | null;
  wipeType: WipeType | null;
  packageType: PackageType | null;
  quantityPerPack: number | null;
  packCount: number | null;
  totalQuantity: number | null;
  unitTypeExtracted: "fralda" | "lenco" | null;
  possibleCanonicalId: string | null;
  extractionConfidence: number;
  matchingConfidence: number;
  status: CandidateStatus;
  rejectionReasons: string[];
  sourceUrls: string[];
}

export interface SearchResult {
  query: string;
  title: string;
  url: string;
  snippet: string | null;
  provider: string;
  collectedAt: string;
}

export interface CrawlResult {
  url: string;
  title: string | null;
  text: string | null;
  html: string | null;
  metadata: Record<string, unknown> | null;
  provider: string;
  collectedAt: string;
  fromCache: boolean;
}

export interface ExtractionResult {
  candidate: ProductCandidate;
  confidence: number;
  warnings: string[];
}

export interface MatchingResult {
  candidateId: string;
  possibleCanonicalId: string | null;
  confidence: number;
  reasons: string[];
  status: "matched" | "needs_review" | "unmatched";
}

export interface PipelineRunConfig {
  mode: "mock" | "discover" | "crawl" | "export_review" | "import_review";
  dryRun: boolean;
  maxQueriesPerRun: number;
  maxResultsPerQuery: number;
  firecrawlEnabled: boolean;
  firecrawlMaxPagesPerRun: number;
  cacheTtlDays: number;
}

export interface ReviewRow {
  suggested_id: string;
  category: string;
  brand: string;
  line: string;
  size: string;
  diaper_type: string;
  usage_type: string;
  wipe_type: string;
  package_type: string;
  pack_count: string;
  quantity_per_pack: string;
  quantity_total: string;
  unit_type: string;
  confidence: string;
  source_urls: string;
  status: string;
  rejection_reasons: string;
  review_notes: string;
  corrected_brand: string;
  corrected_line: string;
  corrected_size: string;
  corrected_quantity: string;
  approved: string;
}

