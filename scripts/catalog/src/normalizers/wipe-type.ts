import { WipeType } from "../types/catalog";
import { normalizeText } from "./text";

export function detectWipeType(titleRaw: string): { wipeType: WipeType; signals: string[] } {
  const t = normalizeText(titleRaw);
  const signals: string[] = [];

  if (t.includes("recem nascido") || t.includes("recem-nascido") || t.includes("rn")) {
    signals.push("recem_nascido");
    return { wipeType: "recem_nascido", signals };
  }
  if (t.includes("sensitive") || t.includes("sensivel") || t.includes("pele sensivel")) {
    signals.push("sensitive");
    return { wipeType: "sensitive", signals };
  }

  return { wipeType: "regular", signals };
}

