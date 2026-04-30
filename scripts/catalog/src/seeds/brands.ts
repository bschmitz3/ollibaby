import { CanonicalCategory } from "../types/catalog";

export const DIAPER_BRANDS = [
  "Pampers",
  "Huggies",
  "MamyPoko",
  "Personal",
  "Babysec",
  "Turma da Mônica",
  "Cremer",
  "Pom Pom",
  "Needs",
  "Panvel",
  "Parent's Choice",
  "Capricho",
] as const;

export const WIPE_BRANDS = [
  "Pampers",
  "Huggies",
  "MamyPoko",
  "Granado",
  "Johnson's",
  "Needs",
  "Baby Dove",
  "Mustela",
  "Bepantol Baby",
  "Fisher-Price",
  "Piquitucho",
  "Anjinho",
  "Cremer",
  "Cottonbaby",
  "FeelClean",
  "Meu Bebê",
] as const;

export const ALL_BRANDS_BY_CATEGORY: Record<CanonicalCategory, readonly string[]> = {
  diaper: DIAPER_BRANDS,
  wipe: WIPE_BRANDS,
};

