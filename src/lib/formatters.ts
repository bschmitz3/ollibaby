import type { UnitType } from "@/types/product";

export function formatCurrencyFromCents(valueInCents: number): string {
  if (!Number.isFinite(valueInCents)) {
    throw new Error("valueInCents must be a finite number.");
  }

  const valueInReais = valueInCents / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais);
}

export function getUnitLabel(unitType: UnitType): string {
  if (unitType === "diaper") return "fralda";
  return "lenço";
}

export function formatUnitPriceFromCents(
  valueInCents: number,
  unitType: UnitType,
): string {
  return `${formatCurrencyFromCents(valueInCents)} por ${getUnitLabel(unitType)}`;
}
