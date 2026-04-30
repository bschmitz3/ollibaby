import { normalizeText } from "./text";
import { DiaperType } from "../types/catalog";

const TYPE_HINTS: Array<{ type: string; hints: string[] }> = [
  { type: "pants", hints: ["pants", "calca", "calcao"] },
  { type: "fita", hints: ["fita", "adesiva"] },
  { type: "noturna", hints: ["noturna", "noite"] },
  { type: "piscina", hints: ["piscina", "swim"] },
  { type: "refil", hints: ["refil", "refill"] },
  { type: "kit", hints: ["kit", "combo"] },
  { type: "pacote", hints: ["pacote", "pct", "pack"] },
];

export function detectType(titleRaw: string): { type: string | null; matches: string[] } {
  const t = normalizeText(titleRaw);
  const matches = TYPE_HINTS.filter((x) => x.hints.some((h) => t.includes(h))).map((x) => x.type);
  const unique = Array.from(new Set(matches));
  if (unique.length === 0) return { type: null, matches: [] };
  // If multiple matches, keep the most specific first-ish by priority order above
  return { type: unique[0]!, matches: unique };
}

export function inferDiaperTypeFromSignals(input: {
  titleRaw: string;
  line: string | null;
  detectedType: string | null;
}): { inferred: DiaperType; reason: string | null } {
  if (input.detectedType === "pants") return { inferred: "pants", reason: "explicit_pants" };
  if (input.detectedType === "fita") return { inferred: "fita", reason: "explicit_fita" };

  const t = normalizeText(input.titleRaw);
  if (t.includes("pants") || t.includes("calca") || t.includes("calcao")) {
    return { inferred: "pants", reason: "pants_signal" };
  }

  const line = normalizeText(input.line ?? "");
  const shouldDefaultToFita =
    ["confort sec", "supreme care", "tripla protecao", "personal baby", "babysec", "pom pom"].some(
      (h) => line.includes(h),
    );

  const hasContrarySignal = ["piscina", "swim", "noturna", "noite"].some((h) => t.includes(h));
  if (shouldDefaultToFita && !hasContrarySignal) {
    return { inferred: "fita", reason: "safe_default_for_known_lines" };
  }

  return { inferred: "unknown", reason: null };
}

