import { normalizeText } from "./text";

export type DiaperSize = "RN" | "P" | "M" | "G" | "XG" | "XXG";

const SIZE_PATTERNS: Array<{ size: DiaperSize; re: RegExp }> = [
  { size: "XXG", re: /\bxxg\b/i },
  { size: "XG", re: /\bxg\b/i },
  { size: "RN", re: /\brn\b/i },
  { size: "P", re: /\b(p)\b/i },
  { size: "M", re: /\b(m)\b/i },
  { size: "G", re: /\b(g)\b/i },
];

export function detectDiaperSize(titleRaw: string): {
  size: DiaperSize | null;
  ambiguous: boolean;
  matches: DiaperSize[];
} {
  const t = normalizeText(titleRaw);
  const matches = SIZE_PATTERNS.filter(({ re }) => re.test(t)).map((p) => p.size);
  const unique = Array.from(new Set(matches));
  if (unique.length === 0) return { size: null, ambiguous: false, matches: [] };
  if (unique.length === 1) return { size: unique[0]!, ambiguous: false, matches: unique };
  return { size: null, ambiguous: true, matches: unique };
}

