export function stripAccents(input: string): string {
  return input.normalize("NFD").replace(/\p{Diacritic}+/gu, "");
}

export function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function normalizeText(input: string): string {
  const noAccents = stripAccents(input);
  const lowered = noAccents.toLowerCase();
  return normalizeWhitespace(lowered);
}

export function includesAny(haystackNormalized: string, needlesNormalized: string[]): boolean {
  return needlesNormalized.some((n) => haystackNormalized.includes(n));
}

export function slugifyStable(input: string): string {
  const n = normalizeText(input);
  return n
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

