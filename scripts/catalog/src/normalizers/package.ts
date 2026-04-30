import { PackageType } from "../types/catalog";
import { normalizeText } from "./text";

export function detectPackageType(input: {
  titleRaw: string;
  packCount: number | null;
}): { packageType: PackageType; signals: string[] } {
  const t = normalizeText(input.titleRaw);
  const signals: string[] = [];

  const hasRefil = t.includes("refil") || t.includes("refill");
  const hasCombo = t.includes("combo") || t.includes("kit") || t.includes("conjunto");

  if (hasRefil) {
    signals.push("refil");
    return { packageType: "refil", signals };
  }

  if ((input.packCount ?? 0) > 1) {
    // Rule: if packCount > 1 => kit (unless explicit combo wording dominates)
    if (t.includes("combo")) {
      signals.push("combo");
      return { packageType: "combo", signals };
    }
    signals.push("multi_pack");
    return { packageType: "kit", signals };
  }

  if (hasCombo) {
    // packCount=1 but says kit/combo (marketing). Keep combo.
    signals.push("combo");
    return { packageType: "combo", signals };
  }

  return { packageType: "pacote", signals };
}

