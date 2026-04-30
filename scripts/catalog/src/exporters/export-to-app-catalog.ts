import path from "node:path";
import { pathToFileURL } from "node:url";
import { FILES } from "../config/paths";
import { fileExists, readJson, writeText } from "../cache/fs";
import { CanonicalProduct } from "../types/catalog";
import { validateApprovedProducts } from "../validators/validate-approved";

export const APP_CATALOG_PATH = path.resolve(process.cwd(), "src/data/catalog/canonical-products.ts");

export function renderAppCatalogTs(products: CanonicalProduct[]): string {
  return `/**
 * AUTO-GENERATED FILE.
 * Source: scripts/catalog/data/final/canonical-products.approved.json
 * Generated at: ${new Date().toISOString()}
 *
 * Do not edit manually. Re-run: pnpm catalog:export-to-app
 */

export type CanonicalCategory = "diaper" | "wipe";
export type CanonicalStatus = "active" | "review" | "discontinued";

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
  quantity: number;
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

export const canonicalProducts = ${JSON.stringify(products, null, 2)} as const satisfies readonly CanonicalProduct[];
`;
}

export async function exportApprovedToAppCatalog(): Promise<{ outPath: string; count: number }> {
  if (!(await fileExists(FILES.finalApproved))) {
    throw new Error("canonical-products.approved.json does not exist. Run catalog:import-review first.");
  }

  const json = await readJson<unknown>(FILES.finalApproved);
  const report = validateApprovedProducts(json);
  if (report.errorsCount > 0) {
    throw new Error(
      `Approved catalog validation failed (errorsCount=${report.errorsCount}):\n- ${report.errors.join("\n- ")}`,
    );
  }

  const products = json as CanonicalProduct[];
  const ts = renderAppCatalogTs(products);
  await writeText(APP_CATALOG_PATH, ts);
  return { outPath: APP_CATALOG_PATH, count: products.length };
}

async function main() {
  const res = await exportApprovedToAppCatalog();
  console.log(JSON.stringify(res, null, 2));
}

function isEntrypoint(): boolean {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  return import.meta.url === pathToFileURL(argv1).href;
}

if (isEntrypoint()) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}

