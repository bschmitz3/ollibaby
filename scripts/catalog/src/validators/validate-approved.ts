import path from "node:path";
import { pathToFileURL } from "node:url";
import { FILES, DATA_DIRS } from "../config/paths";
import { fileExists, readJson, writeJson } from "../cache/fs";
import { CanonicalProduct } from "../types/catalog";
import { normalizeText } from "../normalizers/text";
import { OUT_OF_MVP_KEYWORDS } from "../seeds/rejection-keywords";

export interface ValidationReport {
  validatedAt: string;
  count: number;
  errorsCount: number;
  errors: string[];
}

export function validateApprovedProducts(input: unknown): ValidationReport {
  const errors: string[] = [];
  const now = new Date().toISOString();

  if (!Array.isArray(input)) {
    return { validatedAt: now, count: 0, errorsCount: 1, errors: ["approved_json_not_array"] };
  }

  const products = input as CanonicalProduct[];
  const ids = new Set<string>();

  const outOfMvpNeedles = OUT_OF_MVP_KEYWORDS.map((k) => normalizeText(k));

  const addError = (msg: string) => errors.push(msg);
  const getAttr = (p: CanonicalProduct, key: string): unknown => {
    const attrs = p.normalizedAttributes;
    if (!attrs || typeof attrs !== "object") return undefined;
    const record = attrs as Record<string, unknown>;
    return record[key];
  };

  products.forEach((p, idx) => {
    if (!p || typeof p !== "object") {
      addError(`product_${idx}_not_object`);
      return;
    }

    if (!p.id || typeof p.id !== "string") addError(`product_${idx}_missing_id`);
    else {
      if (ids.has(p.id)) addError(`duplicate_id:${p.id}`);
      ids.add(p.id);
    }

    if (p.category !== "diaper" && p.category !== "wipe") addError(`product_${idx}_invalid_category`);
    if (!p.brand || typeof p.brand !== "string") addError(`product_${idx}_missing_brand`);
    if (typeof p.quantity !== "number" || p.quantity <= 0) addError(`product_${idx}_invalid_quantity`);
    if (p.unitType !== "fralda" && p.unitType !== "lenco") addError(`product_${idx}_invalid_unitType`);

    // "Nenhum produto rejected ou needs_review deve aparecer."
    // CanonicalProduct doesn't have those statuses; approved export should be active.
    if (p.status !== "active") addError(`product_${idx}_non_active_status:${p.status}`);

    const nameNorm = normalizeText(p.name ?? "");
    if (outOfMvpNeedles.some((k) => nameNorm.includes(k))) addError(`product_${idx}_out_of_mvp_keyword`);

    if (p.category === "diaper") {
      if (!p.size) addError(`product_${idx}_diaper_missing_size`);
      const diaperType = getAttr(p, "diaperType");
      const usageType = getAttr(p, "usageType");
      const packageType = getAttr(p, "packageType");
      if (!diaperType) addError(`product_${idx}_missing_normalizedAttributes.diaperType`);
      if (!usageType) addError(`product_${idx}_missing_normalizedAttributes.usageType`);
      if (!packageType) addError(`product_${idx}_missing_normalizedAttributes.packageType`);
    }

    if (p.category === "wipe") {
      const packageType = getAttr(p, "packageType");
      if (!packageType) addError(`product_${idx}_missing_normalizedAttributes.packageType`);
    }
  });

  return { validatedAt: now, count: products.length, errorsCount: errors.length, errors };
}

export async function validateApprovedFile(): Promise<ValidationReport> {
  if (!(await fileExists(FILES.finalApproved))) {
    const report: ValidationReport = {
      validatedAt: new Date().toISOString(),
      count: 0,
      errorsCount: 1,
      errors: ["canonical-products.approved.json_missing"],
    };
    await writeJson(path.join(DATA_DIRS.final, "validation-report.json"), report);
    return report;
  }

  const json = await readJson<unknown>(FILES.finalApproved);
  const report = validateApprovedProducts(json);
  await writeJson(path.join(DATA_DIRS.final, "validation-report.json"), report);
  return report;
}

async function main() {
  const report = await validateApprovedFile();
  console.log(
    JSON.stringify(
      {
        count: report.count,
        errorsCount: report.errorsCount,
        errors: report.errors,
      },
      null,
      2,
    ),
  );

  process.exitCode = report.errorsCount > 0 ? 1 : 0;
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

