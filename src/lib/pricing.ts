/**
 * Pricing helpers.
 *
 * Monetary values are stored in BRL cents.
 * Example: 7990 = R$ 79,90.
 */

export type CalculateUnitPriceInput = {
  totalPriceInCents: number;
  quantity: number;
};

export function calculateUnitPriceInCents(
  input: CalculateUnitPriceInput,
): number {
  const { totalPriceInCents, quantity } = input;

  if (!Number.isFinite(totalPriceInCents)) {
    throw new Error("totalPriceInCents must be a finite number.");
  }
  if (!Number.isFinite(quantity)) {
    throw new Error("quantity must be a finite number.");
  }
  if (quantity <= 0) {
    throw new Error("quantity must be greater than 0.");
  }
  if (totalPriceInCents < 0) {
    throw new Error("totalPriceInCents must be greater than or equal to 0.");
  }

  return totalPriceInCents / quantity;
}

export type CalculateTotalPriceInput = {
  priceInCents: number;
  shippingPriceInCents?: number;
};

export function calculateTotalPriceInCents(
  input: CalculateTotalPriceInput,
): number {
  const { priceInCents, shippingPriceInCents } = input;

  if (!Number.isFinite(priceInCents) || priceInCents < 0) {
    throw new Error("priceInCents must be a finite number greater than or equal to 0.");
  }

  if (shippingPriceInCents !== undefined) {
    if (!Number.isFinite(shippingPriceInCents) || shippingPriceInCents < 0) {
      throw new Error(
        "shippingPriceInCents must be a finite number greater than or equal to 0 when provided.",
      );
    }
  }

  return priceInCents + (shippingPriceInCents ?? 0);
}

export type CalculateUnitPriceWithShippingInput = {
  priceInCents: number;
  shippingPriceInCents?: number;
  quantity: number;
};

export function calculateUnitPriceWithShippingInCents(
  input: CalculateUnitPriceWithShippingInput,
): number {
  const totalPriceInCents = calculateTotalPriceInCents({
    priceInCents: input.priceInCents,
    shippingPriceInCents: input.shippingPriceInCents,
  });

  return calculateUnitPriceInCents({
    totalPriceInCents,
    quantity: input.quantity,
  });
}
