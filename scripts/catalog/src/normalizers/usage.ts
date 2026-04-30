import { UsageType } from "../types/catalog";
import { normalizeText } from "./text";

export function detectUsageType(titleRaw: string): { usageType: UsageType; signals: string[] } {
  const t = normalizeText(titleRaw);
  const signals: string[] = [];

  if (t.includes("piscina") || t.includes("swim")) {
    signals.push("piscina");
    return { usageType: "piscina", signals };
  }
  if (t.includes("noturna") || t.includes("noite")) {
    signals.push("noturna");
    return { usageType: "noturna", signals };
  }

  return { usageType: "regular", signals };
}

