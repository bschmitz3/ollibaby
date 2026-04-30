import { normalizeText } from "./text";

const KNOWN_LINES: Array<{ line: string; hints: string[] }> = [
  { line: "Confort Sec", hints: ["confort sec", "confort-se", "confort"] },
  { line: "Pants", hints: ["pants", "calca", "calca-fralda", "calca fralda"] },
  { line: "Premium Care", hints: ["premium care", "premiun care"] },
  { line: "Supreme Care", hints: ["supreme care"] },
  { line: "Tripla Proteção", hints: ["tripla protecao", "tripla-protecao"] },
  { line: "Dia e Noite", hints: ["dia e noite", "dia-noite"] },
  { line: "Baby", hints: ["baby"] },
];

export function detectLine(titleRaw: string): {
  line: string | null;
  ambiguous: boolean;
  matches: string[];
} {
  const t = normalizeText(titleRaw);
  const matches = KNOWN_LINES.filter((l) => l.hints.some((h) => t.includes(h))).map((l) => l.line);
  const unique = Array.from(new Set(matches));

  if (unique.length === 0) return { line: null, ambiguous: false, matches: [] };
  if (unique.length === 1) return { line: unique[0]!, ambiguous: false, matches: unique };
  return { line: null, ambiguous: true, matches: unique };
}

